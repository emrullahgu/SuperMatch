# SuperMatch ile Başlarken - Hızlı Kılavuz

## 1️⃣ Projeyi İndirin ve Kurun

```bash
# Projeyi indirin
cd SuperMatch

# Tüm bağımlılıkları yükleyin
npm run install:all
```

## 2️⃣ Environment Dosyalarını Oluşturun

### Server için
```bash
cd server
copy .env.example .env
```

### Client için
```bash
cd client
copy .env.example .env.local
```

## 3️⃣ MongoDB'yi Başlatın

### Yöntem 1: Docker (Kolay)
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7
```

### Yöntem 2: Yerel MongoDB
MongoDB'yi bilgisayarınıza kurun ve başlatın.

## 4️⃣ Uygulamayı Başlatın

Ana dizinden:
```bash
npm run dev
```

Bu komut hem server (port 5000) hem de client (port 3000) başlatır.

## 5️⃣ Tarayıcıda Açın

http://localhost:3000 adresine gidin ve "Hemen Başla" butonuna tıklayın!

## ✅ Test Edin

1. İki farklı tarayıcı penceresi açın
2. Her ikisinde de http://localhost:3000/chat adresine gidin
3. Kamera/mikrofon izinlerini verin
4. "Eşleşme Bul" butonuna tıklayın
5. İki pencere birbirine bağlanmalı!

## 🐛 Sorun mu Yaşıyorsunuz?

### MongoDB Hatası
```bash
# MongoDB'nin çalıştığını kontrol edin
docker ps
# veya yerel MongoDB için
mongod --version
```

### Port Çakışması
Server veya client portları kullanılıyorsa, .env dosyalarında değiştirin.

### Kamera Çalışmıyor
- Tarayıcıda kamera/mikrofon izinlerini kontrol edin
- HTTPS olmadan sadece localhost'ta çalışır

## 📚 Daha Fazla Bilgi

Detaylı kurulum için [SETUP.md](SETUP.md) dosyasına bakın.

---

**İyi Eğlenceler! 🎉**
