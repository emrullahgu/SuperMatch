import { Server as SocketIOServer, Socket } from 'socket.io';
import { RedisClientType } from 'redis';
import { logger } from '../utils/logger';
import { MatchingService } from '../services/matchingService';
import { MessageService } from '../services/messageService';
import { ModerationService } from '../services/moderationService';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  User,
  Filter,
  WebRTCOffer,
  WebRTCAnswer,
  ICECandidate,
} from '../../../shared/types';

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

const matchingService = new MatchingService();
const messageService = new MessageService();
const moderationService = new ModerationService();

// Aktif kullanıcıları takip et
const activeUsers = new Map<string, User>();

export const handleSocketConnection = (
  io: SocketIOServer<ClientToServerEvents, ServerToClientEvents>,
  socket: TypedSocket,
  redisClient: RedisClientType | null
) => {
  logger.info(`Yeni kullanıcı bağlandı: ${socket.id}`);

  // Kullanıcı bilgilerini kaydet
  socket.on('user:update', async (userUpdates) => {
    try {
      const user: User = {
        id: socket.id,
        socketId: socket.id,
        isAnonymous: true,
        interests: [],
        isPremium: false,
        status: 'online',
        reputation: 100,
        joinedAt: new Date(),
        lastActive: new Date(),
        ...userUpdates,
      };

      activeUsers.set(socket.id, user);
      socket.emit('user:connected', user);

      // İstatistikleri güncelle
      broadcastStats(io);

      logger.info(`Kullanıcı profili güncellendi: ${socket.id}`);
    } catch (error) {
      logger.error('Kullanıcı güncellenirken hata:', error);
      socket.emit('error', {
        code: 'USER_UPDATE_ERROR',
        message: 'Kullanıcı güncellenirken bir hata oluştu',
      });
    }
  });

  // Eşleşme başlat
  socket.on('match:start', async (filters?: Filter) => {
    try {
      const user = activeUsers.get(socket.id);
      if (!user) {
        socket.emit('error', {
          code: 'USER_NOT_FOUND',
          message: 'Kullanıcı bulunamadı. Lütfen sayfayı yenileyin.',
        });
        return;
      }

      user.status = 'searching';
      activeUsers.set(socket.id, user);

      socket.emit('match:searching');

      // Eşleşme bul
      const match = await matchingService.findMatch(user, filters, activeUsers);

      if (match) {
        const partnerId = match.user1.id === socket.id ? match.user2.socketId : match.user1.socketId;
        const partnerSocket = io.sockets.sockets.get(partnerId);

        if (partnerSocket) {
          // Her iki kullanıcıya da eşleşmeyi bildir
          socket.emit('match:found', match);
          partnerSocket.emit('match:found', match);

          // Kullanıcı durumlarını güncelle
          const user1 = activeUsers.get(match.user1.id);
          const user2 = activeUsers.get(match.user2.id);
          
          if (user1) {
            user1.status = 'matched';
            activeUsers.set(match.user1.id, user1);
          }
          if (user2) {
            user2.status = 'matched';
            activeUsers.set(match.user2.id, user2);
          }

          // Match verisini socket room olarak sakla
          socket.join(`match-${match.id}`);
          partnerSocket.join(`match-${match.id}`);

          logger.info(`Eşleşme bulundu: ${match.id} (${socket.id} <-> ${partnerId})`);
        }
      } else {
        logger.info(`${socket.id} için eşleşme bulunamadı, bekleniyor...`);
      }
    } catch (error) {
      logger.error('Eşleşme başlatılırken hata:', error);
      socket.emit('error', {
        code: 'MATCH_START_ERROR',
        message: 'Eşleşme başlatılırken bir hata oluştu',
      });
    }
  });

  // Eşleşmeyi atla
  socket.on('match:skip', async () => {
    try {
      await endMatch(io, socket, 'skip');
      
      // Yeni eşleşme bul
      const user = activeUsers.get(socket.id);
      if (user) {
        socket.emit('match:searching');
        const match = await matchingService.findMatch(user, undefined, activeUsers);
        // ... eşleşme bulma mantığı
      }
    } catch (error) {
      logger.error('Skip işleminde hata:', error);
      socket.emit('error', {
        code: 'SKIP_ERROR',
        message: 'Atla işlemi başarısız oldu',
      });
    }
  });

  // Eşleşmeyi sonlandır
  socket.on('match:end', async () => {
    await endMatch(io, socket, 'user_left');
  });

  // Mesaj gönder
  socket.on('message:send', async (content) => {
    try {
      const user = activeUsers.get(socket.id);
      if (!user || user.status !== 'matched') {
        return;
      }

      // İçerik moderasyonu
      const isAllowed = await moderationService.checkMessage(content);
      if (!isAllowed) {
        socket.emit('error', {
          code: 'MESSAGE_BLOCKED',
          message: 'Mesajınız uygunsuz içerik içeriyor',
        });
        return;
      }

      // Mesajı kaydet ve gönder
      const message = await messageService.createMessage({
        senderId: socket.id,
        content,
        type: 'text',
      });

      // Partner'a gönder
      const rooms = Array.from(socket.rooms);
      const matchRoom = rooms.find(room => room.startsWith('match-'));
      
      if (matchRoom) {
        socket.to(matchRoom).emit('message:received', message);
      }

      logger.info(`Mesaj gönderildi: ${socket.id}`);
    } catch (error) {
      logger.error('Mesaj gönderilirken hata:', error);
      socket.emit('error', {
        code: 'MESSAGE_SEND_ERROR',
        message: 'Mesaj gönderilemedi',
      });
    }
  });

  // Typing indicator
  socket.on('message:typing', async (isTyping) => {
    const rooms = Array.from(socket.rooms);
    const matchRoom = rooms.find(room => room.startsWith('match-'));
    
    if (matchRoom) {
      socket.to(matchRoom).emit('message:typing', isTyping);
    }
  });

  // WebRTC Signaling - Offer
  socket.on('webrtc:offer', async (offer: WebRTCOffer) => {
    const rooms = Array.from(socket.rooms);
    const matchRoom = rooms.find(room => room.startsWith('match-'));
    
    if (matchRoom) {
      socket.to(matchRoom).emit('webrtc:offer', offer);
      logger.info(`WebRTC offer gönderildi: ${socket.id}`);
    }
  });

  // WebRTC Signaling - Answer
  socket.on('webrtc:answer', async (answer: WebRTCAnswer) => {
    const rooms = Array.from(socket.rooms);
    const matchRoom = rooms.find(room => room.startsWith('match-'));
    
    if (matchRoom) {
      socket.to(matchRoom).emit('webrtc:answer', answer);
      logger.info(`WebRTC answer gönderildi: ${socket.id}`);
    }
  });

  // WebRTC Signaling - ICE Candidate
  socket.on('webrtc:ice-candidate', async (candidate: ICECandidate) => {
    const rooms = Array.from(socket.rooms);
    const matchRoom = rooms.find(room => room.startsWith('match-'));
    
    if (matchRoom) {
      socket.to(matchRoom).emit('webrtc:ice-candidate', candidate);
    }
  });

  // Kullanıcı rapor et
  socket.on('user:report', async (report) => {
    try {
      await moderationService.handleReport({
        ...report,
        id: '',
        timestamp: new Date(),
        status: 'pending',
      });

      socket.emit('notification', {
        id: Date.now().toString(),
        type: 'success',
        title: 'Rapor Gönderildi',
        message: 'Raporunuz başarıyla gönderildi. İncelenecektir.',
        duration: 3000,
      });

      logger.info(`Rapor gönderildi: ${socket.id} -> ${report.reportedUserId}`);
    } catch (error) {
      logger.error('Rapor gönderilirken hata:', error);
      socket.emit('error', {
        code: 'REPORT_ERROR',
        message: 'Rapor gönderilemedi',
      });
    }
  });

  // Kullanıcı engelle
  socket.on('user:block', async (userId) => {
    try {
      // Engelleme işlemi
      await endMatch(io, socket, 'reported');
      
      socket.emit('notification', {
        id: Date.now().toString(),
        type: 'success',
        title: 'Kullanıcı Engellendi',
        message: 'Kullanıcı başarıyla engellendi.',
        duration: 3000,
      });

      logger.info(`Kullanıcı engellendi: ${socket.id} -> ${userId}`);
    } catch (error) {
      logger.error('Engelleme hatası:', error);
    }
  });

  // İstatistik talep et
  socket.on('stats:request', async () => {
    sendStats(socket);
  });

  // Bağlantı koptuğunda
  socket.on('disconnect', async () => {
    logger.info(`Kullanıcı ayrıldı: ${socket.id}`);
    
    await endMatch(io, socket, 'other_left');
    activeUsers.delete(socket.id);
    
    broadcastStats(io);
  });
};

// Yardımcı fonksiyonlar
async function endMatch(
  io: SocketIOServer<ClientToServerEvents, ServerToClientEvents>,
  socket: TypedSocket,
  reason: 'user_left' | 'other_left' | 'skip' | 'reported'
) {
  const rooms = Array.from(socket.rooms);
  const matchRoom = rooms.find(room => room.startsWith('match-'));

  if (matchRoom) {
    // Partner'a bildir
    socket.to(matchRoom).emit('match:ended', reason);
    socket.emit('match:ended', reason);

    // Room'dan çıkar
    io.in(matchRoom).socketsLeave(matchRoom);

    // Kullanıcı durumlarını güncelle
    const user = activeUsers.get(socket.id);
    if (user) {
      user.status = 'online';
      activeUsers.set(socket.id, user);
    }

    logger.info(`Eşleşme sonlandı: ${matchRoom} (${reason})`);
  }
}

function sendStats(socket: TypedSocket) {
  const stats = {
    onlineUsers: activeUsers.size,
    activeMatches: Math.floor(Array.from(activeUsers.values()).filter(u => u.status === 'matched').length / 2),
    totalUsers: activeUsers.size,
    averageWaitTime: 5,
    peakHours: [19, 20, 21, 22],
  };

  socket.emit('stats:update', stats);
}

function broadcastStats(io: SocketIOServer<ClientToServerEvents, ServerToClientEvents>) {
  const stats = {
    onlineUsers: activeUsers.size,
    activeMatches: Math.floor(Array.from(activeUsers.values()).filter(u => u.status === 'matched').length / 2),
    totalUsers: activeUsers.size,
    averageWaitTime: 5,
    peakHours: [19, 20, 21, 22],
  };

  io.emit('stats:update', stats);
}
