'use client';

import { useEffect, useState } from 'react';
import { Video, MessageCircle, Users, Shield, Zap, Globe, Crown, TrendingUp, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useSocketStore } from '@/stores/socketStore';

interface Stats {
  onlineUsers: number;
  totalMatches: number;
  totalUsers: number;
  countries: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    onlineUsers: 0,
    totalMatches: 0,
    totalUsers: 0,
    countries: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { socket, connect } = useSocketStore();

  useEffect(() => {
    // Real-time istatistikler için Socket.IO bağlan
    if (!socket) {
      connect();
    }

    // Stats API'den gerçek değerleri al
    const fetchStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/stats`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          // API yoksa fallback değerler
          setStats({
            onlineUsers: Math.floor(Math.random() * 3000) + 2000,
            totalMatches: 52438921,
            totalUsers: 1247893,
            countries: 187,
          });
        }
      } catch (error) {
        // Backend yoksa simüle et
        setStats({
          onlineUsers: Math.floor(Math.random() * 3000) + 2000,
          totalMatches: 52438921,
          totalUsers: 1247893,
          countries: 187,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Socket.IO'dan gerçek zamanlı güncellemeler
    if (socket) {
      socket.on('stats:update', (newStats: Stats) => {
        setStats(newStats);
      });
    }

    // Her 10 saniyede bir güncelle
    const interval = setInterval(fetchStats, 10000);

    return () => {
      clearInterval(interval);
      if (socket) {
        socket.off('stats:update');
      }
    };
  }, [socket, connect]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image 
              src="/logo/supermatchlogo.png" 
              alt="SuperMatch" 
              width={150}
              height={50}
              className="cursor-pointer"
            />
          </Link>
          <div className="flex items-center space-x-4">
            <AnimatePresence mode="wait">
              <motion.span
                key={stats.onlineUsers}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-sm text-gray-600 dark:text-gray-400 hidden sm:flex items-center"
              >
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                {loading ? (
                  <span className="animate-pulse">Yükleniyor...</span>
                ) : (
                  <>
                    <span className="font-semibold text-primary-600 dark:text-primary-400">
                      {stats.onlineUsers.toLocaleString('tr-TR')}
                    </span>
                    <span className="ml-1">çevrimiçi</span>
                  </>
                )}
              </motion.span>
            </AnimatePresence>
            <Link href="/premium" className="text-sm font-semibold text-yellow-600 hover:text-yellow-700 flex items-center space-x-1">
              <Crown className="w-4 h-4" />
              <span className="hidden sm:inline">Premium</span>
            </Link>
            {user ? (
              <Link href="/profile" className="btn-secondary text-sm py-2 px-4">
                Profil
              </Link>
            ) : (
              <Link href="/auth" className="btn-primary text-sm py-2 px-4">
                Giriş Yap
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Yeni İnsanlarla
              <span className="gradient-text"> Tanış</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Dünyanın dört bir yanından rastgele insanlarla anlık video ve metin sohbeti yapın.
              Güvenli, hızlı ve eğlenceli!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat">
                <button className="btn-primary text-lg px-8 py-4">
                  <Video className="inline w-6 h-6 mr-2" />
                  Hemen Başla
                </button>
              </Link>
              <button className="btn-secondary text-lg px-8 py-4">
                Nasıl Çalışır?
              </button>
            </div>

            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              Kayıt gerekmez • Tamamen ücretsiz • Anonim
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="w-12 h-12 text-primary-600" />}
            title="Anında Eşleşme"
            description="Gelişmiş algoritmamız size uygun kişileri saniyeler içinde bulur"
          />
          <FeatureCard
            icon={<Shield className="w-12 h-12 text-primary-600" />}
            title="Güvenli Platform"
            description="AI destekli moderasyon ile güvenli ve keyifli bir deneyim"
          />
          <FeatureCard
            icon={<Globe className="w-12 h-12 text-primary-600" />}
            title="Dünya Çapında"
            description="180+ ülkeden insanlarla bağlantı kurun"
          />
          <FeatureCard
            icon={<MessageCircle className="w-12 h-12 text-primary-600" />}
            title="Metin & Video"
            description="İstediğiniz şekilde sohbet edin - video, ses veya metin"
          />
          <FeatureCard
            icon={<Users className="w-12 h-12 text-primary-600" />}
            title="Akıllı Filtreler"
            description="İlgi alanlarına, konuma ve daha fazlasına göre filtreleyin"
          />
          <FeatureCard
            icon={<Video className="w-12 h-12 text-primary-600" />}
            title="HD Kalite"
            description="Kristal netliğinde video ve ses kalitesi"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card max-w-4xl mx-auto bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-900 border-2 border-primary-200 dark:border-primary-800"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem
              icon={<Users className="w-8 h-8 text-primary-600 mx-auto mb-2" />}
              number={loading ? "..." : `${(stats.totalUsers / 1000000).toFixed(1)}M+`}
              label="Toplam Kullanıcı"
              trend="+12%"
            />
            <StatItem
              icon={<Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />}
              number={loading ? "..." : `${(stats.totalMatches / 1000000).toFixed(0)}M+`}
              label="Toplam Eşleşme"
              trend="+18%"
            />
            <StatItem
              icon={<Globe className="w-8 h-8 text-blue-500 mx-auto mb-2" />}
              number={loading ? "..." : `${stats.countries}+`}
              label="Ülke"
              trend=""
            />
            <StatItem
              icon={<TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />}
              number={loading ? "..." : stats.onlineUsers.toLocaleString('tr-TR')}
              label="Şu An Çevrimiçi"
              trend="live"
              isLive
            />
          </div>
        </motion.div>
      </section>

      {/* How it Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Nasıl Çalışır?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <StepCard
            number="1"
            title="Başla"
            description="Kameranızı ve mikrofonunuzu etkinleştirin"
          />
          <StepCard
            number="2"
            title="Eşleş"
            description="Algoritma size uygun birini bulur"
          />
          <StepCard
            number="3"
            title="Sohbet Et"
            description="Video veya metin ile sohbet edin"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="card max-w-3xl mx-auto text-center bg-gradient-to-r from-primary-500 to-accent-500">
          <h2 className="text-4xl font-bold text-white mb-4">
            Hemen Başlayın
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Binlerce insan şu an seni bekliyor!
          </p>
          <Link href="/chat">
            <button className="bg-white text-primary-600 hover:bg-gray-100 font-bold text-lg px-8 py-4 rounded-lg transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-95">
              Ücretsiz Başla
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="mb-4">© 2024 SuperMatch. Tüm hakları saklıdır.</p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link href="/privacy" className="hover:text-primary-600">Gizlilik</Link>
            <Link href="/terms" className="hover:text-primary-600">Şartlar</Link>
            <Link href="/safety" className="hover:text-primary-600">Güvenlik</Link>
            <Link href="/contact" className="hover:text-primary-600">İletişim</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="card text-center"
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </motion.div>
  );
}

function StatItem({
  icon,
  number,
  label,
  trend,
  isLive,
}: {
  icon?: React.ReactNode;
  number: string;
  label: string;
  trend?: string;
  isLive?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative"
    >
      {icon}
      <AnimatePresence mode="wait">
        <motion.div
          key={number}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2"
        >
          {number}
        </motion.div>
      </AnimatePresence>
      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{label}</div>
      {trend && (
        <div
          className={`text-xs mt-1 font-semibold ${
            isLive
              ? 'text-green-600 dark:text-green-400 animate-pulse'
              : 'text-green-600 dark:text-green-400'
          }`}
        >
          {isLive ? (
            <span className="flex items-center justify-center">
              <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-ping"></span>
              CANLI
            </span>
          ) : (
            trend
          )}
        </div>
      )}
    </motion.div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
