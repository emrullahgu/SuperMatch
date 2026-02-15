'use client';

import { useEffect, useRef, useState } from 'react';
import { Video, VideoOff, Mic, MicOff, SkipForward, X, AlertTriangle } from 'lucide-react';
import { useVideoStore } from '@/stores/videoStore';
import { useSocketStore } from '@/stores/socketStore';
import { Filter } from '@/shared/types';

interface VideoChatProps {
  isSearching: boolean;
  onStartChat: (filters?: Filter) => void;
  hasMatch: boolean;
}

export function VideoChat({ isSearching, onStartChat, hasMatch }: VideoChatProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const {
    localStream,
    remoteStream,
    isVideoEnabled,
    isAudioEnabled,
    toggleVideo,
    toggleAudio,
    createPeerConnection,
  } = useVideoStore();

  const { skipMatch, endMatch, reportUser, currentMatch } = useSocketStore();

  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');

  // Local video stream'i video elementine bağla
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Remote video stream'i video elementine bağla
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Eşleşme bulunduğunda peer connection oluştur
  useEffect(() => {
    if (hasMatch && localStream) {
      createPeerConnection();
    }
  }, [hasMatch, localStream, createPeerConnection]);

  const handleSkip = () => {
    skipMatch();
  };

  const handleEnd = () => {
    if (confirm('Eşleşmeyi sonlandırmak istediğinize emin misiniz?')) {
      endMatch();
    }
  };

  const handleReport = () => {
    if (currentMatch && reportReason) {
      const partnerId = currentMatch.user1.id === currentMatch.user2.id 
        ? currentMatch.user1.id 
        : currentMatch.user2.id;
      reportUser(partnerId, reportReason);
      setShowReportDialog(false);
      setReportReason('');
      endMatch();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Video Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Remote Video */}
        <div className="video-container relative bg-gray-800">
          {hasMatch && remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              {isSearching ? (
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white text-lg">Eşleşme aranıyor...</p>
                  <p className="text-gray-400 text-sm mt-2">Bu birkaç saniye sürebilir</p>
                </div>
              ) : (
                <div className="text-center">
                  <Video className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                  <p className="text-white text-lg mb-4">Yabancı Kamera</p>
                  <button onClick={() => onStartChat()} className="btn-primary">
                    Eşleşme Bul
                  </button>
                </div>
              )}
            </div>
          )}
          
          {hasMatch && (
            <div className="absolute top-4 right-4">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                Bağlı
              </span>
            </div>
          )}
        </div>

        {/* Local Video */}
        <div className="video-container relative bg-gray-800">
          {localStream ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover mirror"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <VideoOff className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                <p className="text-white text-lg">Kamera Kapalı</p>
              </div>
            </div>
          )}
          
          <div className="absolute bottom-4 left-4">
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
              Sen
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-center space-x-4">
        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full ${
            isVideoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
          } text-white transition-colors`}
          title={isVideoEnabled ? 'Kamerayı Kapat' : 'Kamerayı Aç'}
        >
          {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
        </button>

        <button
          onClick={toggleAudio}
          className={`p-4 rounded-full ${
            isAudioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
          } text-white transition-colors`}
          title={isAudioEnabled ? 'Mikrofonu Kapat' : 'Mikrofonu Aç'}
        >
          {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
        </button>

        {hasMatch && (
          <>
            <button
              onClick={handleSkip}
              className="p-4 rounded-full bg-yellow-600 hover:bg-yellow-700 text-white transition-colors"
              title="Sonraki Kişi"
            >
              <SkipForward size={24} />
            </button>

            <button
              onClick={handleEnd}
              className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
              title="Eşleşmeyi Bitir"
            >
              <X size={24} />
            </button>

            <button
              onClick={() => setShowReportDialog(true)}
              className="p-4 rounded-full bg-orange-600 hover:bg-orange-700 text-white transition-colors"
              title="Rapor Et"
            >
              <AlertTriangle size={24} />
            </button>
          </>
        )}
      </div>

      {/* Report Dialog */}
      {showReportDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Kullanıcıyı Rapor Et</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Bu kullanıcıyı neden raporluyorsunuz?
            </p>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="input-field mb-4 h-32 resize-none"
              placeholder="Raporlama sebebini yazın..."
            />
            <div className="flex space-x-4">
              <button
                onClick={handleReport}
                className="btn-danger flex-1"
                disabled={!reportReason}
              >
                Rapor Et
              </button>
              <button
                onClick={() => setShowReportDialog(false)}
                className="btn-secondary flex-1"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
}
