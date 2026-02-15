# 🚀 NETLIFY DEPLOYMENT - ENVIRONMENT VARIABLES

## ⚠️ ÖNEMLİ: Netlify'da Environment Variables Ekle!

Netlify deployment başarısız oldu çünkü environment variables ayarlanmamış.

---

## 📝 NETLIFY'DA YAPILACAKLAR

### 1. Netlify Dashboard'a Git

https://app.netlify.com/sites/[YOUR-SITE-NAME]/settings/deploys

### 2. Environment Variables'a Git

**Site settings** > **Build & deploy** > **Environment variables**

### 3. Şu Değişkenleri Ekle

#### ✅ ZORUNLU (Supabase için):

```bash
NEXT_PUBLIC_SUPABASE_URL
https://ordtiljbhnfxgqmsipnl.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
sb_publishable_MnTAq6_QfdDgTpVvNCfbbw_l_VVZOaj
```

**NOT**: Eğer bu key çalışmazsa:
1. Supabase Dashboard → Settings → API
2. "anon public" key'i kopyala (uzun JWT token, `eyJhbG...` ile başlar)
3. Netlify'da NEXT_PUBLIC_SUPABASE_ANON_KEY'i güncelle

#### ⚙️ API URLs (Backend hazır olunca):

```bash
NEXT_PUBLIC_API_URL
http://localhost:5000
# Backend deploy edince: https://your-backend-url.com

NEXT_PUBLIC_SOCKET_URL
http://localhost:5000
# Backend deploy edince: https://your-backend-url.com

NEXT_PUBLIC_APP_URL
https://your-site-name.netlify.app
```

#### 💳 STRIPE (Premium özellikler için - opsiyonel):

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
pk_test_... veya pk_live_...
# Stripe Dashboard → Developers → API keys → Publishable key

STRIPE_SECRET_KEY
sk_test_... veya sk_live_...
# Stripe Dashboard → Developers → API keys → Secret key (GİZLİ TUT!)

STRIPE_WEBHOOK_SECRET
whsec_...
# Stripe Dashboard → Webhooks → Add endpoint → Signing secret
```

#### 🔧 DİĞER (Opsiyonel):

```bash
NEXT_PUBLIC_ENABLE_ANALYTICS
false

NODE_VERSION
20
# Supabase Node.js 20+ öneriyor

NPM_VERSION
10
```

---

## 💡 ENVIRONMENT VARIABLE NASIL EKLENİR?

### Tek Tek Eklemek:

1. "Add a variable" butonuna tıkla
2. **Key**: `NEXT_PUBLIC_SUPABASE_URL`
3. **Value**: `https://ordtiljbhnfxgqmsipnl.supabase.co`
4. **Scopes**: "All" seç (veya "Production" + "Deploy Previews")
5. "Create variable" tıkla
6. Diğerleri için tekrarla

### Toplu Eklemek:

1. "Import from a .env file" tıkla
2. Şunu yapıştır:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ordtiljbhnfxgqmsipnl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_MnTAq6_QfdDgTpVvNCfbbw_l_VVZOaj
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=https://your-site-name.netlify.app
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NODE_VERSION=20
```

3. "Import variables" tıkla

---

## 🔄 DEPLOY EDİLMİŞ DEĞİŞİKLİKLER (GitHub'a push edildi)

### ✅ Düzeltilen Hatalar:

1. **Critters modülü hatası** ✓
   - `next.config.js`'de `optimizeCss: true` kapatıldı
   - Artık eksik modül hatası olmayacak

2. **Supabase URL hatası** ✓
   - `.env.production`'a gerçek Supabase bilgileri eklendi
   - Netlify environment variables'a da eklenmeli

3. **Image domains** ✓
   - `ordtiljbhnfxgqmsipnl.supabase.co` eklendi
   - Supabase'den avatar yükleme çalışacak

---

## 🚀 YENİDEN DEPLOY ET

### Otomatik (GitHub push ile):

```bash
git add -A
git commit -m "fix: Netlify deployment errors"
git push origin main
```

Netlify otomatik deploy edecek!

### Manuel (Netlify'dan):

1. Netlify Dashboard → Deploys
2. "Trigger deploy" → "Deploy site"

---

## ✅ DEPLOYMENT KONTROL LİSTESİ

Build başarılı olması için:

- [x] ✅ `.env.production` güncellendi (commit edildi)
- [x] ✅ `next.config.js` düzeltildi (commit edildi)
- [ ] ⚠️ Netlify environment variables eklenmeli
- [ ] ⚠️ Yeniden deploy edilmeli

Environment variables ekledikten sonra:

```
Netlify → Deploys → Trigger deploy → Deploy site
```

---

## 🐛 SORUN GİDERME

### "Invalid supabaseUrl" Hatası

**Neden**: Netlify environment variables ayarlanmamış

**Çözüm**:
1. Netlify → Site settings → Environment variables
2. `NEXT_PUBLIC_SUPABASE_URL` ekle
3. Redeploy et

### "Cannot find module 'critters'" Hatası

**Neden**: `optimizeCss` açıktı ama module yoktu

**Çözüm**: ✅ Düzeltildi! `next.config.js`'de kapatıldı

### Build Log "Node.js 18 deprecated" Uyarısı

**Neden**: Supabase Node.js 20+ istiyor

**Çözüm**:
1. Netlify environment variables'a ekle: `NODE_VERSION=20`
2. Redeploy et

### Build Başarılı Ama Site Açılmıyor

**Neden**: Backend server yok (video chat, eşleşme için gerekli)

**Çözüm**: Şimdilik normal! Frontend deployed, backend ileride eklenecek.

---

## 📊 DEPLOY SONRASI TEST

Build başarılı olduktan sonra:

1. **Homepage**: `https://your-site.netlify.app`
   - Logo görünüyor mu?
   - Premium butonu çalışıyor mu?

2. **Auth Page**: `/auth`
   - Login/Register formu görünüyor mu?
   - (Henüz çalışmayacak, backend gerekli)

3. **Premium Page**: `/premium`
   - Fiyatlar görünüyor mu? (₺49/₺349)

4. **Mobile**: Chrome DevTools → Device Toolbar
   - Responsive görünüyor mu?

---

## 🎯 SONRAKI ADIMLAR

1. ✅ Netlify environment variables ekle (5 dakika)
2. ✅ Redeploy et (otomatik veya manuel)
3. ✅ Build log'u kontrol et - YEŞİL olmalı!
4. ✅ Site'yi aç ve test et
5. ⏳ Backend server deploy et (ileride)
6. ⏳ Stripe setup yap (ileride)

---

**Şimdi Netlify Dashboard'a git ve environment variables'ı ekle! 5 dakika sonra site çalışacak!** 🚀
