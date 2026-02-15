import express, { Application, Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createClient } from 'redis';
import rateLimit from 'express-rate-limit';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import statsRoutes from './routes/stats';

// Socket handlers
import { handleSocketConnection } from './socket/handler';

// Middleware
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

// App setup
const app: Application = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Redis client (opsiyonel)
let redisClient: ReturnType<typeof createClient> | null = null;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.',
});
app.use('/api', limiter);

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint bulunamadı',
    path: req.path,
  });
});

// Error handler
app.use(errorHandler);

// Socket.IO connection handler
io.on('connection', (socket) => {
  handleSocketConnection(io, socket, redisClient);
});

// Database connection
const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/supermatch');
    logger.info('MongoDB bağlantısı başarılı');
  } catch (error) {
    logger.error('MongoDB bağlantı hatası:', error);
    process.exit(1);
  }
};

// Redis connection (opsiyonel)
const connectRedis = async () => {
  try {
    if (process.env.REDIS_HOST) {
      redisClient = createClient({
        socket: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT || '6379'),
        },
        password: process.env.REDIS_PASSWORD || undefined,
      });

      redisClient.on('error', (err) => logger.error('Redis hatası:', err));
      await redisClient.connect();
      logger.info('Redis bağlantısı başarılı');
    }
  } catch (error) {
    logger.warn('Redis bağlantı hatası (devam ediliyor):', error);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();
  await connectRedis();

  httpServer.listen(PORT, () => {
    logger.info(`🚀 Server ${PORT} portunda çalışıyor`);
    logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🌍 CORS: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
  });
};

// Graceful shutdown
const gracefulShutdown = async () => {
  logger.info('Sunucu kapatılıyor...');
  
  httpServer.close(() => {
    logger.info('HTTP sunucusu kapatıldı');
  });

  await mongoose.connection.close();
  logger.info('MongoDB bağlantısı kapatıldı');

  if (redisClient) {
    await redisClient.quit();
    logger.info('Redis bağlantısı kapatıldı');
  }

  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Yakalanmamış hata:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('İşlenmeyen Promise rejection:', reason);
  process.exit(1);
});

// Start the server
startServer().catch((error) => {
  logger.error('Sunucu başlatma hatası:', error);
  process.exit(1);
});

export { app, io, redisClient };
