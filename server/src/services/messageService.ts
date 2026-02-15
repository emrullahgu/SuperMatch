import { v4 as uuidv4 } from 'uuid';
import { Message } from '../../../shared/types';
import { logger } from '../utils/logger';

export class MessageService {
  private messages: Map<string, Message[]> = new Map();

  /**
   * Yeni mesaj oluştur
   */
  async createMessage(data: {
    matchId?: string;
    senderId: string;
    content: string;
    type: 'text' | 'system' | 'emoji' | 'sticker';
  }): Promise<Message> {
    const message: Message = {
      id: uuidv4(),
      matchId: data.matchId || '',
      senderId: data.senderId,
      content: data.content,
      timestamp: new Date(),
      type: data.type,
      isRead: false,
    };

    // Mesajı kaydet
    if (data.matchId) {
      const matchMessages = this.messages.get(data.matchId) || [];
      matchMessages.push(message);
      this.messages.set(data.matchId, matchMessages);
    }

    logger.info(`Mesaj oluşturuldu: ${message.id}`);
    return message;
  }

  /**
   * Eşleşme mesajlarını al
   */
  getMatchMessages(matchId: string): Message[] {
    return this.messages.get(matchId) || [];
  }

  /**
   * Mesajı okundu olarak işaretle
   */
  markAsRead(messageId: string, matchId: string): void {
    const messages = this.messages.get(matchId);
    if (messages) {
      const message = messages.find(m => m.id === messageId);
      if (message) {
        message.isRead = true;
      }
    }
  }

  /**
   * Eşleşme mesajlarını temizle
   */
  clearMatchMessages(matchId: string): void {
    this.messages.delete(matchId);
    logger.info(`Eşleşme mesajları temizlendi: ${matchId}`);
  }

  /**
   * Tüm mesajları temizle (bellek yönetimi için)
   */
  cleanup(): void {
    // 1 saatten eski mesajları sil
    const oneHourAgo = Date.now() - 3600000;
    
    for (const [matchId, messages] of this.messages.entries()) {
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.timestamp.getTime() < oneHourAgo) {
          this.messages.delete(matchId);
          logger.info(`Eski mesajlar temizlendi: ${matchId}`);
        }
      }
    }
  }
}
