import { create } from 'zustand';
import { useSocketStore } from './socketStore';

interface VideoStore {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peerConnection: RTCPeerConnection | null;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;

  initializeMedia: () => Promise<void>;
  createPeerConnection: () => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
  cleanup: () => void;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const useVideoStore = create<VideoStore>((set, get) => ({
  localStream: null,
  remoteStream: null,
  peerConnection: null,
  isVideoEnabled: true,
  isAudioEnabled: true,

  initializeMedia: async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      set({ localStream: stream });
      console.log('Medya stream oluşturuldu');
    } catch (error) {
      console.error('Medya erişim hatası:', error);
      throw error;
    }
  },

  createPeerConnection: () => {
    const { localStream } = get();
    const socket = useSocketStore.getState().socket;

    if (!localStream || !socket) {
      console.error('Local stream veya socket bulunamadı');
      return;
    }

    const peerConnection = new RTCPeerConnection(ICE_SERVERS);

    // Local stream'i peer connection'a ekle
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    // Remote stream geldiğinde
    peerConnection.ontrack = (event) => {
      console.log('Remote stream alındı');
      set({ remoteStream: event.streams[0] });
    };

    // ICE candidate geldiğinde
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('webrtc:ice-candidate', {
          candidate: event.candidate.candidate,
          sdpMLineIndex: event.candidate.sdpMLineIndex || 0,
          sdpMid: event.candidate.sdpMid || '',
        });
      }
    };

    // Connection state değişikliklerini izle
    peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.connectionState);
    };

    // Socket event listeners
    socket.on('webrtc:offer', async (offer) => {
      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit('webrtc:answer', { type: 'answer' as const, sdp: answer.sdp! });
      } catch (error) {
        console.error('Offer işleme hatası:', error);
      }
    });

    socket.on('webrtc:answer', async (answer) => {
      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error('Answer işleme hatası:', error);
      }
    });

    socket.on('webrtc:ice-candidate', async (candidate) => {
      try {
        await peerConnection.addIceCandidate(
          new RTCIceCandidate({
            candidate: candidate.candidate,
            sdpMLineIndex: candidate.sdpMLineIndex,
            sdpMid: candidate.sdpMid,
          })
        );
      } catch (error) {
        console.error('ICE candidate hatası:', error);
      }
    });

    set({ peerConnection });

    // Offer oluştur ve gönder
    peerConnection
      .createOffer()
      .then((offer) => peerConnection.setLocalDescription(offer))
      .then(() => {
        const desc = peerConnection.localDescription!;
        socket.emit('webrtc:offer', { type: 'offer' as const, sdp: desc.sdp! });
      })
      .catch((error) => console.error('Offer oluşturma hatası:', error));
  },

  toggleVideo: () => {
    const { localStream, isVideoEnabled } = get();
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoEnabled;
      });
      set({ isVideoEnabled: !isVideoEnabled });
    }
  },

  toggleAudio: () => {
    const { localStream, isAudioEnabled } = get();
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioEnabled;
      });
      set({ isAudioEnabled: !isAudioEnabled });
    }
  },

  cleanup: () => {
    const { localStream, peerConnection } = get();

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    if (peerConnection) {
      peerConnection.close();
    }

    set({
      localStream: null,
      remoteStream: null,
      peerConnection: null,
    });
  },
}));
