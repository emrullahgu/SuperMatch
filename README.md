# 🎥 SuperMatch - Modern Video Chat Platform

<div align="center">

**Yeni insanlarla tanış, sohbet et, eğlen!**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)

[🌐 Demo](https://supermatch.netlify.app) | [📖 Dokümantasyon](DEPLOYMENT.md) | [🔧 Supabase Setup](SUPABASE_SETUP.md)

</div>

---

Omegle, Azar, Chatroulette ve benzeri platformların **en iyi özelliklerini** birleştiren modern, güvenli ve kullanıcı dostu rastgele video chat uygulaması.

## ✨ Özellikler

### 🎯 Temel Özellikler
- ✅ **Rastgele Video Eşleşme** - Dünyanın her yerinden insanlarla tanış
- ✅ **Gerçek Zamanlı Sohbet** - Anlık metin mesajlaşma (Socket.IO)
- ✅ **WebRTC Video/Audio** - Düşük gecikmeli, yüksek kaliteli görüşme
- ✅ **Skip Özelliği** - Beğenmediğin kişiyi atla, yeni biriyle eşleş
- ✅ **Filtreler** - Cinsiyet, yaş, ülke ve ilgi alanlarına göre filtrele

### 🔐 Güvenlik & Moderasyon
- ✅ **Kullanıcı Kaydı** - Email veya OAuth (Google, GitHub) ile güvenli giriş
- ✅ **Supabase Auth** - Modern, güvenilir authentication sistemi
- ✅ **Rapor Sistemi** - Uygunsuz davranışları bildir
- ✅ **Engelleme** - İstenmeyen kullanıcıları engelle
- ✅ **Row Level Security** - Database seviyesinde veri güvenliği
- ✅ **Veri Gizliliği** - KVKK uyumlu, şifreli depolama

### 💎 Premium Özellikler (Stripe ile)
- 🔒 **Cinsiyet Filtresi** - Sadece erkek veya kadın kullanıcılarla eşleş
- 🔒 **Yaş Aralığı** - Belirli yaş grubundan kişilerle sohbet et
- 🔒 **Ülke Seçimi** - İstediğin ülkeden insanlarla tanış
- 🔒 **İlgi Alanları** - Ortak hobisi olanları bul
- 🔒 **Reklamsız Deneyim** - Kesintisiz kullanım
- 🔒 **Öncelikli Eşleşme** - Daha hızlı eşleş

**Fiyatlar:**
- 💳 Aylık: ₺49
- 💳 Yıllık: ₺349 (40% indirim!)

### 📱 Mobil & PWA
- ✅ **Responsive Tasarım** - Tüm cihazlarda mükemmel görünüm
- ✅ **Progressive Web App** - Ana ekrana ekle, uygulama gibi kullan
- ✅ **Offline Destek** - İnternet yokken bile bazı özellikler çalışır
- ✅ **Touch Friendly** - Mobil cihazlar için optimize edilmiş UI

## 🛠️ Teknoloji Stack

### Frontend
- **Framework**: Next.js 14 (App Router) + TypeScript
- **UI**: React 18 + Tailwind CSS + Framer Motion
- **State**: Zustand (auth, video, socket stores)
- **Forms**: React Hook Form + Zod
- **Real-time**: Socket.IO Client
- **Video**: WebRTC API
- **PWA**: next-pwa

### Backend
- **Runtime**: Node.js + Express
- **WebSocket**: Socket.IO
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email + OAuth)
- **Payments**: Stripe (Subscriptions + Webhooks)
- **Storage**: Supabase Storage (Avatars)
- **Caching**: Redis (opsiyonel)
- **TensorFlow.js** - AI moderasyon

### DevOps & Deployment
- **Docker** - Containerization
- **Nginx** - Reverse proxy
- **PM2** - Process manager
- **TURN/STUN Servers** - WebRTC bağlantısı

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- MongoDB
- Redis (opsiyonel)

### Adımlar

1. **Depoyu klonlayın**
```bash
git clone https://github.com/emrullahgu/supermatch.git
cd supermatch
```

2. **Bağımlılıkları yükleyin**
```bash
npm run install:all
```

3. **Environment değişkenlerini ayarlayın**
```bash
# Server .env
cp server/.env.example server/.env

# Client .env
cp client/.env.example client/.env
```

4. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:5000

## 🔧 Yapılandırma

### Server Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/supermatch
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
TURN_SERVER_URL=turn:your-turn-server.com
TURN_USERNAME=username
TURN_PASSWORD=password
AI_MODERATION_API_KEY=your-api-key
```

### Client Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## 🏗️ Proje Yapısı

```
supermatch/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # Pages (App Router)
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities
│   │   ├── stores/        # State management
│   │   └── types/         # TypeScript types
│   └── public/            # Static assets
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middleware
│   │   ├── socket/        # Socket.io handlers
│   │   └── utils/         # Helper functions
│   └── tests/             # Test files
│
└── shared/                # Shared types and constants
```

## 🎮 Kullanım

### Anonim Kullanıcı
1. Ana sayfayı ziyaret edin
2. Filtrelerinizi seçin (opsiyonel)
3. "Başla" butonuna tıklayın
4. Webcam ve mikrofon erişimini onaylayın
5. Rastgele bir kullanıcıyla eşleşin

### Kayıtlı Kullanıcı
1. Üye olun veya giriş yapın
2. Profilinizi özelleştirin
3. İlgi alanlarınızı ekleyin
4. Premium özelliklere erişin
5. Geçmiş eşleşmelerinizi görün (opsiyonel)

## 🔐 Güvenlik

- Tüm kullanıcı verileri şifrelenir
- WebRTC bağlantıları peer-to-peer'dir
- AI destekli içerik moderasyonu
- Raporlama sistemi ile kötü niyetli kullanıcılar engellenir
- Rate limiting ile DDoS koruması

## 📄 Lisans

MIT License - Detaylar için LICENSE dosyasına bakın

## 🤝 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır. Büyük değişiklikler için lütfen önce bir issue açın.

## 📧 İletişim

Sorularınız için: [email protected]

---

Developed with ❤️ by SuperMatch Team
