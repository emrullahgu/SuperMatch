import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  // Hata türüne göre yanıt ver
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Doğrulama Hatası',
      message: error.message,
      details: error.details || {},
    });
  }

  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Yetkisiz Erişim',
      message: 'Lütfen giriş yapın',
    });
  }

  if (error.name === 'ForbiddenError') {
    return res.status(403).json({
      error: 'Yasak Erişim',
      message: 'Bu işlem için yetkiniz yok',
    });
  }

  if (error.name === 'NotFoundError') {
    return res.status(404).json({
      error: 'Bulunamadı',
      message: error.message || 'İstenen kaynak bulunamadı',
    });
  }

  // Genel hata
  res.status(error.statusCode || 500).json({
    error: 'Sunucu Hatası',
    message: process.env.NODE_ENV === 'production' 
      ? 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
      : error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};
