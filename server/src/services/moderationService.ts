import { Report, ModerationResult } from '../../../shared/types';
import { logger } from '../utils/logger';

export class ModerationService {
  private blockedWords: string[] = [
    // Uygunsuz kelimeler listesi (örnek)
    'spam',
    'scam',
  ];

  private reports: Map<string, Report[]> = new Map();
  private userWarnings: Map<string, number> = new Map();

  /**
   * Mesaj içeriğini kontrol et
   */
  async checkMessage(content: string): Promise<boolean> {
    try {
      // Basit kelime filtresi
      const lowerContent = content.toLowerCase();
      const containsBlockedWord = this.blockedWords.some(word =>
        lowerContent.includes(word)
      );

      if (containsBlockedWord) {
        logger.warn(`Engellenmiş kelime tespit edildi: ${content.substring(0, 20)}...`);
        return false;
      }

      // AI moderasyon (opsiyonel - burada sadece placeholder)
      if (process.env.ENABLE_AI_MODERATION === 'true') {
        const moderationResult = await this.aiModeration(content);
        if (!moderationResult.isSafe) {
          logger.warn(`AI moderasyon engelledi: ${moderationResult.action}`);
          return false;
        }
      }

      return true;
    } catch (error) {
      logger.error('Mesaj moderasyon hatası:', error);
      // Hata durumunda güvenli tarafta ol
      return true;
    }
  }

  /**
   * Video frame kontrolü (opsiyonel - AI ile)
   */
  async checkVideoFrame(frameData: Buffer): Promise<ModerationResult> {
    // Placeholder - gerçek AI implementasyonu burada olacak
    return {
      isSafe: true,
      confidence: 0.95,
      categories: {
        adult: 0.01,
        violence: 0.01,
        hate: 0.01,
        selfHarm: 0.01,
      },
      action: 'allow',
    };
  }

  /**
   * Raporu işle
   */
  async handleReport(report: Report): Promise<void> {
    try {
      // Raporu kaydet
      const userReports = this.reports.get(report.reportedUserId) || [];
      userReports.push(report);
      this.reports.set(report.reportedUserId, userReports);

      // Kullanıcı uyarı sayısını artır
      const warnings = (this.userWarnings.get(report.reportedUserId) || 0) + 1;
      this.userWarnings.set(report.reportedUserId, warnings);

      logger.info(`Rapor kaydedildi: ${report.id} (Toplam uyarı: ${warnings})`);

      // 3 uyarıdan sonra geçici ban
      if (warnings >= 3) {
        await this.banUser(report.reportedUserId);
      }
    } catch (error) {
      logger.error('Rapor işleme hatası:', error);
      throw error;
    }
  }

  /**
   * Kullanıcıyı yasakla
   */
  async banUser(userId: string): Promise<void> {
    logger.warn(`Kullanıcı yasaklandı: ${userId}`);
    // Gerçek implementasyonda database'e kaydet
  }

  /**
   * Kullanıcının rapor sayısını al
   */
  getUserReports(userId: string): number {
    return this.reports.get(userId)?.length || 0;
  }

  /**
   * Kullanıcının uyarı sayısını al
   */
  getUserWarnings(userId: string): number {
    return this.userWarnings.get(userId) || 0;
  }

  /**
   * AI Moderasyon (placeholder)
   */
  private async aiModeration(content: string): Promise<ModerationResult> {
    // Gerçek AI API entegrasyonu burada olacak
    // Örnek: OpenAI Moderation API, Google Cloud Vision API, vb.
    
    return {
      isSafe: true,
      confidence: 0.95,
      categories: {
        adult: 0.01,
        violence: 0.01,
        hate: 0.01,
        selfHarm: 0.01,
      },
      action: 'allow',
    };
  }

  /**
   * Yasaklı kelime ekle
   */
  addBlockedWord(word: string): void {
    if (!this.blockedWords.includes(word.toLowerCase())) {
      this.blockedWords.push(word.toLowerCase());
      logger.info(`Yasaklı kelime eklendi: ${word}`);
    }
  }

  /**
   * Yasaklı kelime çıkar
   */
  removeBlockedWord(word: string): void {
    const index = this.blockedWords.indexOf(word.toLowerCase());
    if (index > -1) {
      this.blockedWords.splice(index, 1);
      logger.info(`Yasaklı kelime çıkarıldı: ${word}`);
    }
  }
}
