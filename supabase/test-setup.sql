-- SuperMatch Supabase Hızlı Test
-- Bu sorguyu Supabase SQL Editor'de çalıştırın

-- ⚠️ NOT: Bu sadece database kontrolü!
-- Backend gerekli özellikler (ileride eklenecek):
--   - Video chat (WebRTC + Socket.IO)
--   - Eşleşme sistemi (Matching algorithm)
--   - Mesajlaşma (Real-time messaging)

-- 1. Tabloların var olup olmadığını kontrol et
SELECT 
  table_name,
  table_schema
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'matches', 'reports', 'premium_subscriptions', 'blocked_users', 'user_settings')
ORDER BY table_name;

-- Eğer sonuç BOŞSA, schema.sql'i ÇALIŞTIR!
-- Eğer tablolar varsa, devam et:

-- 2. RLS (Row Level Security) kontrol
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'matches', 'reports');

-- rowsecurity = true olmalı!

-- 3. Auth kullanıcılarını kontrol et
SELECT 
  id,
  email,
  created_at
FROM auth.users
LIMIT 5;

-- 4. Profilleri kontrol et  
SELECT 
  id,
  username,
  email,
  is_premium
FROM public.profiles
LIMIT 5;
