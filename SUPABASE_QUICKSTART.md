# 🚀 SUPABASE KURULUM - HIZLI BAŞLANGIÇ

## ✅ Supabase Bilgileri Eklendi!

- **Project URL**: https://ordtiljbhnfxgqmsipnl.supabase.co  
- **Status**: `.env.local` dosyasına kaydedildi ✓
- **Server**: Yeniden başlatıldı ✓

---

## 📋 YAPILACAKLAR LİSTESİ

### ⚠️ ZORUNLU (Yoksa uygulama çalışmaz):

#### 1. Database Schema Yükle (3 dakika)

1. Supabase'e gir: https://app.supabase.com/project/ordtiljbhnfxgqmsipnl
2. Sol menüden **SQL Editor** sekmesine tıkla
3. "New query" (Yeni sorgu) butonuna tıkla
4. `supabase/schema.sql` dosyasını aç (bu projede)
5. İçeriği **TÜMÜNÜ** kopyala
6. Supabase SQL Editor'e yapıştır
7. **RUN** butonuna tıkla (veya Ctrl+Enter)
8. ✅ "Success. No rows returned" mesajını görmelisin

#### 2. Authentication'ı Etkinleştir (2 dakika)

1. Sol menüden **Authentication** > **Providers**'a git
2. **Email** provider'ını bul
3. "Enable Email provider" toggle'ını **AÇIK** yap
4. "Save" butonuna tıkla
5. ✅ Email auth aktif

#### 3. API Keys'i Kontrol Et (1 dakika)

1. Sol menüden **Settings** > **API**'ye git
2. Şu bilgilerin doğru olduğunu kontrol et:
   - **Project URL**: `https://ordtiljbhnfxgqmsipnl.supabase.co`
   - **anon public key**: `sb_publishable_...` ile başlamalı

**NOT**: Senin verdiğin key biraz farklı görünüyor. Eğer authentication hata verirse:
- Settings > API > "anon" key'i kopyala
- `.env.local`'de `NEXT_PUBLIC_SUPABASE_ANON_KEY` değerini güncelle

---

### 🧪 TEST ET!

#### Schema Kontrolü (Opsiyonel)

Supabase SQL Editor'de şunu çalıştır:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Görmem gerekenler:
- ✅ blocked_users
- ✅ matches
- ✅ premium_subscriptions
- ✅ profiles
- ✅ reports
- ✅ user_settings

#### Uygulama Testi

1. http://localhost:3005 aç (veya hangi port çalışıyorsa)
2. `/auth` sayfasına git
3. Yeni hesap oluşturmayı dene:
   - Username: test123
   - Email: test@test.com
   - Password: Test123456
   - Age: 25
   - Gender: Seç

**Başarılı olursa**: ✅ Giriş sayfasına yönlendirileceksin!
**Hata alırsan**: Schema yüklenmiş mi kontrol et

---

### 🔒 OPSIYONEL (Daha sonra yapabilirsin):

#### Google OAuth (Premium özellik)

1. [Google Cloud Console](https://console.cloud.google.com)
2. OAuth Client ID oluştur
3. Supabase > Authentication > Providers > Google'a ekle

#### GitHub OAuth (Premium özellik)

1. [GitHub Settings](https://github.com/settings/developers)
2. OAuth App oluştur
3. Supabase > Authentication > Providers > GitHub'a ekle

#### Row Level Security Doğrulama

Supabase > Database > Tables > profiles:
- "Policies" sekmesi açık olmalı
- Her tablo için RLS policy'ler görünmeli

---

## 🐛 SORUN GİDERME

### "Failed to fetch" Hatası
- Schema yüklendi mi kontrol et
- RLS policies aktif mi kontrol et
- Browser console'u kontrol et (F12)

### "Invalid API key" Hatası
- Settings > API'den **anon** key'i tekrar kopyala
- `.env.local` dosyasını güncelle
- `npm run dev` ile server'ı yeniden başlat

### "Email not confirmed" Hatası
- Authentication > Providers > Email
- "Confirm email" kapalı olmalı (development için)

---

## ✅ HAZIR OLDUKTAN SONRA

Schema yüklü + Email auth aktif + Server çalışıyor = **Hemen test et!**

```
http://localhost:3005/auth
```

Yeni kullanıcı oluştur ve giriş yap! 🎉
