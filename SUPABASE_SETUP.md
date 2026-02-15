# SuperMatch - Supabase Setup Talimatları

## 🚀 Hızlı Başlangıç

### 1. Supabase Projesi Oluşturun

1. https://app.supabase.com adresine gidin
2. "New Project" butonuna tıklayın
3. Proje bilgilerini girin:
   - **Project Name**: SuperMatch
   - **Database Password**: Güçlü bir şifre belirleyin (kaydedin!)
   - **Region**: Europe (Central) veya size yakın bölge
   - **Pricing Plan**: Free (başlangıç için yeterli)
4. "Create new project" butonuna tıklayın
5. Proje hazır olana kadar bekleyin (~2 dakika)

### 2. Database Schema'yı Yükleyin

1. Sol menüden **SQL Editor** sekmesine tıklayın
2. "New query" butonuna tıklayın
3. Bu projedeki `supabase/schema.sql` dosyasını açın
4. Tüm içeriği kopyalayın
5. Supabase SQL Editor'e yapıştırın
6. **"RUN"** butonuna tıklayın (Ctrl+Enter veya Cmd+Enter)
7. ✅ "Success. No rows returned" mesajını görmelisiniz

### 3. Authentication Ayarlarını Yapın

#### Email Authentication (Zorunlu)
1. Sol menüden **Authentication** > **Providers**'a gidin
2. **Email** provider'ı bulun
3. "Enable Email provider" toggle'ını açık konuma getirin
4. **"Confirm Email"** seçeneği:
   - Development: Kapalı tutabilirsiniz
   - Production: Açık olmalı
5. "Save" butonuna tıklayın

#### Google OAuth (Opsiyonel - Tavsiye Edilir)
1. [Google Cloud Console](https://console.cloud.google.com/)'a gidin
2. Yeni proje oluşturun veya mevcut birini seçin
3. **APIs & Services** > **Credentials**
4. "Create Credentials" > "OAuth 2.0 Client ID"
5. Application type: **Web application**
6. Name: `SuperMatch`
7. Authorized redirect URIs:
   ```
   https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
   ```
   (Project ref'i Supabase Project Settings > General'dan alın)
8. "Create" butonuna tıklayın
9. **Client ID** ve **Client secret**'ı kopyalayın
10. Supabase'e dönün: Authentication > Providers > Google
11. Client ID ve Client secret'ı yapıştırın
12. "Save" butonuna tıklayın

#### GitHub OAuth (Opsiyonel)
1. [GitHub Settings](https://github.com/settings/developers) > OAuth Apps
2. "New OAuth App" butonuna tıklayın
3. Bilgileri girin:
   - **Application name**: SuperMatch
   - **Homepage URL**: `http://localhost:3000` (development için)
   - **Authorization callback URL**:
     ```
     https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
     ```
4. "Register application" butonuna tıklayın
5. **Client ID** ve **Generate new client secret** ile secret oluşturun
6. Supabase'e dönün: Authentication > Providers > GitHub
7. Client ID ve Client secret'ı yapıştırın
8. "Save" butonuna tıklayın

### 4. API Keys ve URL'leri Alın

1. Sol menüden **Settings** > **API**'ye gidin
2. Aşağıdaki bilgileri kopyalayın:

**Project URL:**
```
https://xxxxxxxxxxxxx.supabase.co
```

**anon/public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (uzun bir string)
```

**service_role key (Secret!):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (başka bir uzun string)
```

### 5. Environment Variables Oluşturun

#### Client (.env.local)
`client` klasöründe `.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI...

# Diğer ayarlar
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Server (.env)
`server` klasöründe `.env` dosyası oluşturun:

```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI... (service_role key)
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI...

# Diğer ayarlar
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/supermatch
```

### 6. Storage Bucket Oluşturun (Avatar/Media için)

1. Sol menüden **Storage** sekmesine gidin
2. "Create a new bucket" butonuna tıklayın
3. Bucket bilgileri:
   - **Name**: `avatars`
   - **Public bucket**: ✅ (Avatarların herkese açık olmasını istiyorsak)
   - **File size limit**: 2 MB
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp`
4. "Create bucket" butonuna tıklayın

Aynı işlemi `screenshots` bucket'ı için de yapın (raporlar için).

### 7. RLS (Row Level Security) Politikalarını Kontrol Edin

Schema dosyasında RLS politikaları zaten tanımlı, ama kontrol edelim:

1. **Database** > **Tables** sekmesine gidin
2. Her tablo için (profiles, matches, reports, vb.):
   - Tabloya tıklayın
   - Policies sekmesini açın
   - Politikaların aktif olduğunu kontrol edin

### 8. Realtime'ı Etkinleştirin (Opsiyonel)

Eğer realtime özellikleri kullanmak isterseniz:

1. **Database** > **Replication** sekmesine gidin
2. İstediğiniz tabloları seçin (örn: `matches`, `messages`)
3. "Enable replication" butonuna tıklayın

## ✅ Test Edin

### Database Bağlantısı Test

```javascript
// test-supabase.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://xxxxx.supabase.co',
  'eyJhbGciOiJIUzI...'
);

async function testConnection() {
  const { data, error } = await supabase
    .from('profiles')
    .select('count');
  
  if (error) {
    console.error('❌ Connection failed:', error);
  } else {
    console.log('✅ Connection successful!');
  }
}

testConnection();
```

### Authentication Test

1. Uygulamanızı başlatın: `npm run dev`
2. `/auth` sayfasına gidin
3. Yeni bir hesap oluşturmayı deneyin
4. Email onayı (eğer aktifse) yapın
5. Giriş yapmayı deneyin
6. Google/GitHub ile giriş test edin

### Database İşlemleri Test

Supabase Dashboard'dan:
1. **Table Editor** sekmesine gidin
2. `profiles` tablosunu açın
3. Kayıt olduğunuz kullanıcının verilerini görmelisiniz

## 🔒 Güvenlik Önerileri

### Production İçin

1. **Email Confirmation**: Authentication > Email'de etkinleştirin
2. **Rate Limiting**: Settings > API > Rate Limiting ayarlayın
3. **Database Password**: Güçlü ve unique tutun
4. **Service Role Key**: Asla client-side'da kullanmayın, sadece server'da
5. **RLS Policies**: Her tablo için aktif ve doğru ayarlandığından emin olun

### Ortam Ayrımı

**Development:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
```

**Production:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
```

İki ayrı Supabase projesi kullanmanız önerilir.

## 📊 Monitoring

### Dashboard'dan İzleme

1. **Overview**: Genel kullanım istatistikleri
2. **Database** > **Performance**: Query performance
3. **Auth** > **Users**: Kullanıcı listesi ve aktivite
4. **Storage** > **Usage**: Depolama kullanımı
5. **Logs**: Tüm işlem logları

### Alerts Kurulumu

1. Project Settings > **Alerts**
2. Email notifications ayarlayın:
   - Database CPU usage > 80%
   - Storage > 80% full
   - Auth rate limit exceeded

## 🆘 Sorun Giderme

### "Failed to fetch" Hatası
- CORS ayarlarını kontrol edin
- Project URL'in doğru olduğunu kontrol edin
- Internet bağlantınızı kontrol edin

### "JWT expired" Hatası
- Token yenileme mekanizmasını kontrol edin
- `auth.autoRefreshToken` true olmalı

### RLS Policy Hatası
- User'ın doğru yetkilere sahip olduğunu kontrol edin
- Policy'leri Table Editor'den test edin

### Connection Pool Hatası
- Free plan: Max 60 connection
- Bağlantıları doğru kapattığınızdan emin olun

## 📚 Ek Kaynaklar

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

## ✨ Tamamlandı!

Artık Supabase backend'iniz hazır! 🎉

Sıradaki adım: `npm run dev` ile uygulamanızı başlatın ve test edin!
