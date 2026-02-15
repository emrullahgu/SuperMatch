// SuperMatch Backend - Minimal Server (MongoDB/Redis olmadan)
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// In-memory stats (gerçek uygulamada database'de olmalı)
let stats = {
  onlineUsers: 0,
  totalMatches: 52438921, // Başlangıç değeri
  totalUsers: 1247893,     // Başlangıç değeri
  countries: 187,
  lastUpdated: Date.now(),
};

// Simüle edilmiş veri artışı (gerçek kullanımda artacak)
setInterval(() => {
  stats.totalMatches += Math.floor(Math.random() * 10) + 5; // Her dakika 5-15 yeni eşleşme
  stats.totalUsers += Math.floor(Math.random() * 5) + 1;    // Her dakika 1-6 yeni kullanıcı
  stats.lastUpdated = Date.now();

  // Tüm bağlı client'lara broadcast et
  io.emit('stats:update', stats);
}, 60000); // Her 1 dakika

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Stats API endpoint
app.get('/api/stats', (_req: Request, res: Response) => {
  res.json(stats);
});

// Socket.IO connection handling
io.on('connection', (socket: Socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // Online user sayısını artır
  stats.onlineUsers++;
  io.emit('stats:update', stats);

  // İlk bağlantıda stats gönder
  socket.emit('stats:update', stats);

  // User disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
    stats.onlineUsers = Math.max(0, stats.onlineUsers - 1);
    io.emit('stats:update', stats);
  });

  // Heartbeat (kullanıcının aktif olduğunu kontrol et)
  socket.on('heartbeat', () => {
    socket.emit('heartbeat:ack');
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`
  🚀 SuperMatch Backend Started!
  ================================
  📡 Server: http://localhost:${PORT}
  🔌 Socket.IO: Ready
  📊 Stats API: http://localhost:${PORT}/api/stats
  ✨ Online Users: ${stats.onlineUsers}
  ================================
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
