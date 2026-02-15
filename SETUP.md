# SuperMatch Kurulum Rehberi

Bu belge, SuperMatch uygulamasını yerel ortamınızda çalıştırmak için adım adım talimatlar içerir.

## 📋 Gereksinimler

- Node.js 18 veya üzeri
- MongoDB 5.0 veya üzeri (opsiyonel - Docker ile çalıştırılabilir)
- Redis (opsiyonel - caching için)
- npm veya yarn

## 🚀 Hızlı Başlangıç

### 1. Repoyu Klonlayın

```bash
git clone <repo-url>
cd SuperMatch
```

### 2. Environment Değişkenlerini Ayarlayın

#### Server (.env)
```bash
cd server
cp .env.example .env
```

`.env` dosyasını açın ve gerekli değerleri girin:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/supermatch
JWT_SECRET=your-secret-key-change-this
CORS_ORIGIN=http://localhost:3000
```

#### Client (.env.local)
```bash
cd ../client
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 3. Bağımlılıkları Yükleyin

Ana dizinden:
```bash
npm run install:all
```

Veya manuel olarak:
```bash
# Root
npm install

# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 4. MongoDB'yi Başlatın

#### Seçenek A: Yerel MongoDB
MongoDB'nin yerel makinenizde çalıştığından emin olun:
```bash
mongod
```

#### Seçenek B: Docker ile MongoDB
```bash
docker run -d -p 27017:27017 --name supermatch-mongo mongo:7
```

### 5. Uygulamayı Başlatın

#### Geliştirme Modu (Önerilen)

Ana dizinden her iki servisi birden başlatın:
```bash
npm run dev
```

Bu komut hem server'ı hem de client'ı aynı anda başlatır.

Veya ayrı terminallerde:

**Terminal 1 - Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```

### 6. Tarayıcıda Açın

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## 🐳 Docker ile Çalıştırma

Tüm servisleri Docker Compose ile başlatın:

```bash
docker-compose up -d
```

Durdurmak için:
```bash
docker-compose down
```

Logları görüntülemek için:
```bash
docker-compose logs -f
```

## 📝 Önemli Notlar

### Kamera ve Mikrofon İzinleri

- Uygulamanın düzgün çalışması için tarayıcınızda kamera ve mikrofon izinlerini vermeniz gerekir
- HTTPS olmadan sadece `localhost` üzerinde medya erişimi çalışır
- Production'da mutlaka HTTPS kullanın

### WebRTC Bağlantı Sorunları

Eğer video bağlantısı kurulmazsa:

1. STUN/TURN sunucu ayarlarını kontrol edin
2. Firewall ayarlarınızı kontrol edin
3. Browser console'da hata mesajlarına bakın

### Port Çakışmaları

Eğer portlar zaten kullanılıyorsa:

**Server portu değiştirmek için:**
```env
# server/.env
PORT=5001
```

**Client portu değiştirmek için:**
```bash
# client/package.json scripts değiştirin
"dev": "next dev -p 3001"
```

## 🔧 Geliştirme İpuçları

### Hot Reload

Her iki servis de hot reload destekler:
- Backend: nodemon ile otomatik yeniden başlatma
- Frontend: Next.js Fast Refresh

### Kod Formatı

ESLint ve TypeScript kullanılır:
```bash
# Server
cd server
npm run lint

# Client
cd client
npm run lint
```

### Veritabanını Temizleme

MongoDB'yi sıfırlamak için:
```bash
mongosh supermatch --eval "db.dropDatabase()"
```

## 🐛 Sorun Giderme

### MongoDB Bağlantı Hatası

```
Error: MongooseServerSelectionError
```

**Çözüm:**
- MongoDB'nin çalıştığından emin olun
- Connection string'in doğru olduğunu kontrol edin
- mongodb://localhost:27017/supermatch

### Socket.IO Bağlantı Hatası

```
Error: WebSocket connection failed
```

**Çözüm:**
- Server'ın çalıştığından emin olun
- CORS ayarlarını kontrol edin
- Browser console'da detaylı hata mesajını okuyun

### Next.js Build Hatası

```
Error: Module not found
```

**Çözüm:**
```bash
cd client
rm -rf .next node_modules
npm install
npm run dev
```

### TypeScript Hataları

Tip tanımları eksikse:
```bash
npm install --save-dev @types/node @types/react
```

## 📚 Ek Kaynaklar

- [WebRTC Documentation](https://webrtc.org/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express Documentation](https://expressjs.com/)

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📞 Destek

Sorun yaşıyorsanız:
- GitHub Issues açın
- [email protected] adresine mail atın

## ⚠️ Production'a Almadan Önce

1. ✅ Environment değişkenlerini güvenli hale getirin
2. ✅ JWT secret'ı değiştirin
3. ✅ HTTPS yapılandırın
4. ✅ Rate limiting ayarlayın
5. ✅ Database yedekleme ayarlayın
6. ✅ Monitoring/logging ekleyin
7. ✅ TURN sunucu yapılandırın (WebRTC için)
8. ✅ CDN kullanın (static assets)
9. ✅ Error tracking ekleyin (Sentry vb.)
10. ✅ Load balancer kurun

---

İyi kodlamalar! 🚀
