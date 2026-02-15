import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  Match,
  Message,
  Stats,
  Filter,
  User,
} from '@/shared/types';

interface SocketStore {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isConnected: boolean;
  currentMatch: Match | null;
  messages: Message[];
  stats: Stats | null;
  currentUser: User | null;

  connect: () => void;
  disconnect: () => void;
  startMatch: (filters?: Filter) => void;
  skipMatch: () => void;
  endMatch: () => void;
  sendMessage: (content: string) => void;
  reportUser: (userId: string, reason: string) => void;
  updateUser: (updates: Partial<User>) => void;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  isConnected: false,
  currentMatch: null,
  messages: [],
  stats: null,
  currentUser: null,

  connect: () => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Socket bağlantısı kuruldu');
      set({ isConnected: true, socket });
    });

    socket.on('disconnect', () => {
      console.log('Socket bağlantısı kesildi');
      set({ isConnected: false });
    });

    socket.on('user:connected', (user) => {
      set({ currentUser: user });
    });

    socket.on('match:found', (match) => {
      console.log('Eşleşme bulundu:', match);
      set({ currentMatch: match, messages: [] });
    });

    socket.on('match:ended', (reason) => {
      console.log('Eşleşme sonlandı:', reason);
      set({ currentMatch: null, messages: [] });
    });

    socket.on('match:searching', () => {
      console.log('Eşleşme aranıyor...');
    });

    socket.on('message:received', (message) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    });

    socket.on('stats:update', (stats) => {
      set({ stats });
    });

    socket.on('error', (error) => {
      console.error('Socket hatası:', error);
      alert(error.message);
    });

    socket.on('notification', (notification) => {
      console.log('Bildirim:', notification);
      // Toast notification göster
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false, currentMatch: null });
    }
  },

  startMatch: (filters?: Filter) => {
    const { socket } = get();
    if (socket) {
      socket.emit('match:start', filters);
    }
  },

  skipMatch: () => {
    const { socket } = get();
    if (socket) {
      socket.emit('match:skip');
    }
  },

  endMatch: () => {
    const { socket } = get();
    if (socket) {
      socket.emit('match:end');
    }
  },

  sendMessage: (content: string) => {
    const { socket } = get();
    if (socket) {
      socket.emit('message:send', content);
    }
  },

  reportUser: (userId: string, reason: string) => {
    const { socket, currentMatch } = get();
    if (socket && currentMatch) {
      socket.emit('user:report', {
        reporterId: socket.id || '',
        reportedUserId: userId,
        matchId: currentMatch.id,
        reason: 'other',
        description: reason,
      });
    }
  },

  updateUser: (updates: Partial<User>) => {
    const { socket } = get();
    if (socket) {
      socket.emit('user:update', updates);
    }
  },
}));
