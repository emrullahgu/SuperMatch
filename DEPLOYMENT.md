# SuperMatch - Production Deployment Rehberi

Bu rehber, SuperMatch uygulamasını Netlify (Frontend) ve Supabase (Backend) kullanarak production'a nasıl deploy edeceğinizi adım adım anlatır.

## 📋 Ön Gereksinimler

✅ GitHub hesabı (kod zaten push edildi)
✅ Netlify hesabı
✅ Supabase hesabı
✅ Stripe hesabı (premium özellikler için)
✅ Domain adı (opsiyonel)

## 🗄️ 1. Supabase Setup

### 1.1 Proje Oluşturma

1. [Supabase Dashboard](https://app.supabase.com)'a gidin
2. "New Project" butonuna tıklayın
3. Proje detaylarını girin:
   - **Name**: SuperMatch
   - **Database Password**: Güçlü bir şifre oluşturun (kaydedin!)
   - **Region**: Size en yakın bölgeyi seçin
4. "Create new project" butonuna tıklayın

### 1.2 Database Schema Kurulumu

1. Sol menüden **SQL Editor**'ü açın
2. `supabase/schema.sql` dosyasının içeriğini kopyalayın
3. SQL Editor'e yapıştırın
4. "Run" butonuna tıklayın
5. ✅ Success mesajını görmelisiniz!

### 1.3 Authentication Ayarları

1. Sol menüden **Authentication** > **Providers**'a gidin
2. Email provider'ı enable edin

#### Google OAuth (Opsiyonel)
1. [Google Cloud Console](https://console.cloud.google.com)
2. OAuth 2.0 Client ID oluşturun
3. Authorized redirect URIs:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
4. Client ID ve Secret'ı Supabase'e girin

#### GitHub OAuth (Opsiyonel)
1. [GitHub Developer Settings](https://github.com/settings/developers)
2. New OAuth App
3. Authorization callback URL:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
4. Client ID ve Secret'ı Supabase'e girin

### 1.4 URL ve API Keys

1. **Settings** > **API**'ye gidin
2. Şu değerleri kaydedin:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbG...` (uzun bir string)

## 💳 2. Stripe Setup (Premium Özellikler)

### 2.1 Hesap Oluşturma

1. [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Hesabınızı oluşturun ve doğrulayın

### 2.2 Product ve Price Oluşturma

**Aylık Plan:**
 1. Products > Add Product
2. Name: "SuperMatch Premium - Aylık"
3. Price: ₺49 (veya istediğiniz fiyat)
4. Billing period: Monthly
5. Create product
6. **Price ID'yi kaydedin**: `price_xxxxx`

**Yıllık Plan:**
1. Products > Add Product
2. Name: "SuperMatch Premium - Yıllık"
3. Price: ₺349
4. Billing period: Yearly
5. Create product
6. **Price ID'yi kaydedin**: `price_yyyyy`

### 2.3 Webhook Kurulumu

1. Developers > Webhooks
2. Add endpoint
3. Endpoint URL: `https://your-backend-url.com/api/stripe/webhook`
4. Events to listen:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. **Signing secret'ı kaydedin**: `whsec_xxxxx`

### 2.4 API Keys

1. Developers > API keys
2. **Publishable key**: `pk_test_xxxx` kaydedin
3. **Secret key**: `sk_test_xxxx` kaydedin

## 🚀 3. Netlify Deployment

### 3.1 Site Oluşturma

1. [Netlify](https://app.netlify.com) giriş yapın
2. "Add new site" > "Import an existing project"
3. GitHub'ı seçin
4. `emrullahgu/SuperMatch` repository'sini seçin

### 3.2 Build Settings

```
Base directory: client
Build command: npm install && npm run build
Publish directory: client/.next
```

### 3.3 Environment Variables

**Site settings** > **Environment variables** > **Add variable**

Aşağıdaki tüm değişkenleri ekleyin:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# API URLs
NEXT_PUBLIC_API_URL=https://your-backend.herokuapp.com
NEXT_PUBLIC_SOCKET_URL=https://your-backend.herokuapp.com

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_xxxxx
NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=price_yyyyy

# App URL
NEXT_PUBLIC_APP_URL=https://supermatch.netlify.app

# Features
NEXT_PUBLIC_ENABLE_PREMIUM=true
NEXT_PUBLIC_ENABLE_OAUTH=true
```

### 3.4 Domain Setup (Opsiyonel)

1. **Domain settings** > **Add custom domain**
2. Domain adınızı girin (örn: `supermatch.com`)
3. DNS kayıtlarını güncelleyin:
   ```
   A	  @	    75.2.60.5
   CNAME	www	  your-site.netlify.app
   ```

### 3.5 HTTPS ve Redirects

Netlify otomatik olarak:
- ✅ HTTPS sertifikası ekler
- ✅ HTTP'den HTTPS'e yönlendirir
- ✅ CDN ile hızlandırır

## 🖥️ 4. Backend Deployment (Server)

### Seçenek A: Heroku

1. [Heroku](https://heroku.com) hesabı oluşturun
2. Yeni app oluşturun: "Create new app"
3. App name: `supermatch-backend`

**Deployment:**
```bash
# Heroku CLI kur
npm install -g heroku

# Login
heroku login

# Git remote ekle
heroku git:remote -a supermatch-backend

# Server'ı deploy et
git subtree push --prefix server heroku main

# veya GitHub Actions ile otomatik
```

**Environment Variables:**
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set SUPABASE_URL=https://xxxxx.supabase.co
heroku config:set SUPABASE_SERVICE_KEY=your_service_key
```

### Seçenek B: Railway.app

1. [Railway](https://railway.app) hesabı
2. "New Project" > "Deploy from GitHub"
3. SuperMatch repo > server klasörü
4. Environment variables ekle
5. Deploy!

### Seçenek C: DigitalOcean App Platform

1. [DigitalOcean](https://cloud.digitalocean.com/apps)
2. "Create App" > GitHub
3. SuperMatch > server
4. Environment variables
5. Deploy

## 📱 5. PWA Setup

Logo dosyalarını oluştur:

```bash
# Logo dosyanızdan farklı boyutlar oluşturun
# 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

# client/public/icons/ klasörüne yerleştirin
```

Online araçlar:
- [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

## ✅ 6. Test ve Doğrulama

### 6.1 Fonksiyonellik Testi

- [ ] Kayıt ol ve giriş yap çalışıyor
- [ ] OAuth (Google/GitHub) çalışıyor
- [ ] Video chat başlatılabiliyor
- [ ] Mesajlaşma çalışıyor
- [ ] Premium satın alma çalışıyor
- [ ] Mobil uyumlu

### 6.2 Performance Testi

[Google PageSpeed Insights](https://pagespeed.web.dev/)
- Hedef: 90+ puan

[WebPageTest](https://www.webpagetest.org/)
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s

### 6.3 PWA Testi

[Lighthouse](https://developers.google.com/web/tools/lighthouse)
- PWA puan: 90+
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

## 🔒 7. Güvenlik

### 7.1 Environment Variables

✅ Asla `.env` dosyalarını Git'e eklemeyin
✅ Production'da güçlü secret keys kullanın
✅ JWT_SECRET'ı değiştirin

### 7.2 Rate Limiting

Backend'de zaten var, ama production'da:
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100 // IP başına max istek
});
```

### 7.3 CORS

```javascript
app.use(cors({
  origin: [
    'https://supermatch.netlify.app',
    'https://supermatch.com'
  ],
  credentials: true
}));
```

## 📊 8. Monitoring ve Analytics

### 8.1 Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### 8.2 Google Analytics

```javascript
// _app.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as gtag from '../lib/gtag';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}
```

### 8.3 Uptime Monitoring

- [UptimeRobot](https://uptimerobot.com/) - Ücretsiz
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

## 🔄 9. CI/CD Pipeline

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install Dependencies
        run: |
          cd client
          npm ci
      
      - name: Build
        run: |
          cd client
          npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --prod
```

## 📝 10. Post-Deployment Checklist

- [ ] SSL sertifikası aktif (yeşil kilit)
- [ ] robots.txt düzgün çalışıyor
- [ ] sitemap.xml oluşturuldu
- [ ] Google Search Console'a eklendi
- [ ] Analytics çalışıyor
- [ ] Error tracking aktif
- [ ] Backup sistemi kuruldu
- [ ] Domain mail adresleri ayarlandı
- [ ] Legal sayfalar (Terms, Privacy) eklendi
- [ ] İletişim formu çalışıyor

## 🎉 Tebrikler!

Uygulamanız artık canlıda! 🚀

**URL'niz**: https://supermatch.netlify.app

## 🆘 Sorun Giderme

### Build Hatası

```bash
# Local'de test et
cd client
npm run build

# Hataları oku ve düzelt
```

### Environment Variables Yüklenmiyor

Netlify'da:
1. Site settings > Environment variables
2. Değişkenlerin doğru olduğunu kontrol et
3. Redeploy et

### Supabase Bağlantı Hatası

1. Supabase Dashboard > Settings > API
2. URL ve anon key'i kontrol et
3. RLS policies doğru ayarlanmış mı?

### Stripe Webhook Çalışmıyor

1. Webhook URL doğru mu?
2. Events seçilmiş mi?
3. Signing secret doğru mu?

## 📧 Destek

Sorunlarınız için:
- GitHub Issues: https://github.com/emrullahgu/SuperMatch/issues
- Email: [email protected]

---

**Başarılar! Harika bir ürün çıkardınız! 🎊**
