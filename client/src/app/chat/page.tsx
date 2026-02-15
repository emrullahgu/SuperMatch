'use client';

import { useEffect, useState } from 'react';
import { VideoChat } from '@/components/VideoChat';
import { ChatPanel } from '@/components/ChatPanel';
import { FilterPanel } from '@/components/FilterPanel';
import { useSocketStore } from '@/stores/socketStore';
import { useVideoStore } from '@/stores/videoStore';
import { Filter } from '@/shared/types';

export default function ChatPage() {
  const { connect, disconnect, isConnected, startMatch, currentMatch } = useSocketStore();
  const { initializeMedia, localStream } = useVideoStore();
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Socket bağlantısı kur
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  const handleStartChat = async (filters?: Filter) => {
    try {
      // Medya erişimi al
      if (!localStream) {
        await initializeMedia();
      }

      setIsSearching(true);
      startMatch(filters);
    } catch (error) {
      console.error('Chat başlatılamadı:', error);
      alert('Kamera veya mikrofon erişimi reddedildi');
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">SuperMatch</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-gray-300 hover:text-white"
            >
              Filtreler
            </button>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-300">Bağlı</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 p-4">
          <VideoChat
            isSearching={isSearching}
            onStartChat={handleStartChat}
            hasMatch={!!currentMatch}
          />
        </div>

        {/* Chat Panel */}
        {currentMatch && (
          <div className="w-80 border-l border-gray-700">
            <ChatPanel />
          </div>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <FilterPanel
          onClose={() => setShowFilters(false)}
          onApply={(filters) => {
            handleStartChat(filters);
            setShowFilters(false);
          }}
        />
      )}
    </div>
  );
}
