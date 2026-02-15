import { v4 as uuidv4 } from 'uuid';
import { User, Match, Filter } from '../../../shared/types';
import { logger } from '../utils/logger';

export class MatchingService {
  private waitingUsers: Map<string, { user: User; filters?: Filter; timestamp: number }> = new Map();
  private activeMatches: Map<string, Match> = new Map();

  /**
   * Kullanıcı için uygun eşleşme bul
   */
  async findMatch(
    user: User,
    filters?: Filter,
    activeUsers?: Map<string, User>
  ): Promise<Match | null> {
    try {
      // Bekleyen kullanıcıları kontrol et
      for (const [userId, waitingData] of this.waitingUsers.entries()) {
        if (userId === user.id) continue;

        const partner = waitingData.user;
        const partnerFilters = waitingData.filter;

        // Filtreleri kontrol et
        if (this.matchesFilters(user, partner, filters, partnerFilters)) {
          // Eşleşme oluştur
          const match = this.createMatch(user, partner);
          
          // Bekleyen listeden çıkar
          this.waitingUsers.delete(userId);
          
          // Aktif eşleşmelere ekle
          this.activeMatches.set(match.id, match);

          logger.info(`Eşleşme oluşturuldu: ${user.id} <-> ${partner.id}`);
          return match;
        }
      }

      // Eşleşme bulunamadı, bekleyen listesine ekle
      this.waitingUsers.set(user.id, {
        user,
        filters,
        timestamp: Date.now(),
      });

      logger.info(`Kullanıcı bekleme listesine eklendi: ${user.id}`);
      
      // 30 saniyeden eski bekleyenleri temizle
      this.cleanupWaitingUsers();

      return null;
    } catch (error) {
      logger.error('Eşleşme bulma hatası:', error);
      throw error;
    }
  }

  /**
   * İki kullanıcının filtrelere uyup uymadığını kontrol et
   */
  private matchesFilters(
    user1: User,
    user2: User,
    filters1?: Filter,
    filters2?: Filter
  ): boolean {
    // Kullanıcı 1'in filtrelerini kontrol et
    if (filters1) {
      // Cinsiyet filtresi
      if (filters1.gender && filters1.gender !== 'any' && user2.gender !== filters1.gender) {
        return false;
      }

      // Yaş filtresi
      if (filters1.ageRange && user2.age) {
        if (user2.age < filters1.ageRange.min || user2.age > filters1.ageRange.max) {
          return false;
        }
      }

      // Ülke filtresi
      if (filters1.country && filters1.country.length > 0 && user2.country) {
        if (!filters1.country.includes(user2.country)) {
          return false;
        }
      }

      // İlgi alanları filtresi
      if (filters1.interests && filters1.interests.length > 0) {
        const commonInterests = user2.interests.filter(
          interest => filters1.interests?.includes(interest)
        );
        if (commonInterests.length === 0) {
          return false;
        }
      }

      // Doğrulanmış kullanıcı filtresi
      if (filters1.onlyVerified && user2.reputation < 80) {
        return false;
      }
    }

    // Kullanıcı 2'nin filtrelerini kontrol et
    if (filters2) {
      if (filters2.gender && filters2.gender !== 'any' && user1.gender !== filters2.gender) {
        return false;
      }

      if (filters2.ageRange && user1.age) {
        if (user1.age < filters2.ageRange.min || user1.age > filters2.ageRange.max) {
          return false;
        }
      }

      if (filters2.country && filters2.country.length > 0 && user1.country) {
        if (!filters2.country.includes(user1.country)) {
          return false;
        }
      }

      if (filters2.interests && filters2.interests.length > 0) {
        const commonInterests = user1.interests.filter(
          interest => filters2.interests?.includes(interest)
        );
        if (commonInterests.length === 0) {
          return false;
        }
      }

      if (filters2.onlyVerified && user1.reputation < 80) {
        return false;
      }
    }

    return true;
  }

  /**
   * Eşleşme oluştur
   */
  private createMatch(user1: User, user2: User): Match {
    const match: Match = {
      id: uuidv4(),
      user1,
      user2,
      startedAt: new Date(),
    };

    return match;
  }

  /**
   * Eşleşmeyi sonlandır
   */
  endMatch(matchId: string): void {
    const match = this.activeMatches.get(matchId);
    if (match) {
      match.endedAt = new Date();
      match.duration = match.endedAt.getTime() - match.startedAt.getTime();
      this.activeMatches.delete(matchId);
      logger.info(`Eşleşme sonlandırıldı: ${matchId}`);
    }
  }

  /**
   * Kullanıcıyı bekleme listesinden çıkar
   */
  removeFromWaiting(userId: string): void {
    this.waitingUsers.delete(userId);
  }

  /**
   * Eski bekleyen kullanıcıları temizle
   */
  private cleanupWaitingUsers(): void {
    const now = Date.now();
    const timeout = 30000; // 30 saniye

    for (const [userId, data] of this.waitingUsers.entries()) {
      if (now - data.timestamp > timeout) {
        this.waitingUsers.delete(userId);
        logger.info(`Zaman aşımından dolayı bekleme listesinden çıkarıldı: ${userId}`);
      }
    }
  }

  /**
   * İstatistikleri al
   */
  getStats() {
    return {
      waitingUsers: this.waitingUsers.size,
      activeMatches: this.activeMatches.size,
    };
  }

  /**
   * Eşleşme geçmişini al
   */
  getMatch(matchId: string): Match | undefined {
    return this.activeMatches.get(matchId);
  }
}
