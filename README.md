# SuperMatch - Modern Video Chat Platform

Omegle, Azar, Chatroulette ve benzeri platformların en iyi özelliklerini birleştiren modern bir rastgele video chat uygulaması.

## 🌟 Özellikler

### Temel Özellikler
- ✅ **Rastgele Video Eşleşme** - WebRTC ile yüksek kaliteli video görüşme
- ✅ **Anlık Mesajlaşma** - Real-time text chat
- ✅ **Skip/Next** - Yeni kişilerle hızlı eşleşme
- ✅ **Filtreler** - Cinsiyet, konum, yaş filtreleri
- ✅ **İlgi Alanları** - Ortak ilgi alanlarına göre eşleşme

### Gelişmiş Özellikler
- 🎯 **Akıllı Eşleştirme** - AI destekli uyumlu kişi bulma
- 🛡️ **Güvenlik Sistemi** - Otomatik içerik moderasyonu
- 🚫 **Raporlama & Blok** - Kullanıcı güvenliği
- 📊 **Canlı İstatistikler** - Online kullanıcı sayısı
- 🌍 **Çoklu Dil** - Türkçe, İngilizce ve daha fazlası
- 🎭 **Anonim Mod** - Kayıt olmadan kullanım
- 👤 **Profil Sistemi** - Kayıtlı kullanıcı avantajları
- 💎 **Premium Özellikler** - Gelişmiş filtreler ve öncelik
- 📱 **Responsive** - Mobil ve masaüstü uyumlu
- 🎨 **Arka Plan Bulanıklaştırma** - Mahremiyet için virtual backgrounds

### Güvenlik Özellikleri
- 🔒 **Şifreli İletişim** - End-to-end encryption
- 🤖 **AI Moderasyon** - Uygunsuz içerik tespiti
- 📸 **Ekran Görüntüsü Koruması** - Screenshot detection
- ⚠️ **Kullanıcı Doğrulama** - Spam ve bot koruması
- 📝 **İçerik Filtreleme** - Otomatik uyarı sistemi

## 🚀 Teknoloji Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Modern styling
- **WebRTC** - Peer-to-peer video/audio
- **Socket.io Client** - Real-time communication
- **Zustand** - State management
- **Framer Motion** - Animasyonlar

### Backend
- **Node.js + Express** - Web server
- **Socket.io** - WebSocket server
- **TypeScript** - Type safety
- **MongoDB** - Veritabanı
- **Redis** - Caching ve queue
- **JWT** - Authentication
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
