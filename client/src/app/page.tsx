'use client';

import { useEffect, useState } from 'react';
import { Video, MessageCircle, Users, Shield, Zap, Globe, Crown, TrendingUp, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useSocketStore } from '@/stores/socketStore';
import { Stats } from '@/shared/types';

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
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Image 
                src="/logo/supermatchlogo.png" 
                alt="SuperMatch Logo" 
                width={150}
                height={50}
                priority
                className="cursor-pointer transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              <div className="hidden text-2xl font-bold gradient-text">
                SuperMatch
              </div>
            </div>
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
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Yeni İnsanlarla
              <span className="gradient-text"> Tanış</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Dünyanın dört bir yanından rastgele insanlarla <span className="font-semibold text-primary-600 dark:text-primary-400">anlık video</span> ve <span className="font-semibold text-accent-600 dark:text-accent-400">metin sohbeti</span> yapın. Güvenli, hızlı ve eğlenceli!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/chat" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-lg px-10 py-5 w-full sm:w-auto shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 flex items-center justify-center space-x-2 group"
                >
                  <Video className="w-6 h-6 group-hover:animate-pulse" />
                  <span className="font-bold">Hemen Başla</span>
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary text-lg px-10 py-5 w-full sm:w-auto flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-6 h-6" />
                <span>Nasıl Çalışır?</span>
              </motion.button>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-4 flex-wrap"
            >
              <span className="flex items-center">
                <Shield className="w-4 h-4 mr-1 text-green-500" />
                Kayıt gerekmez
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center">
                <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                Tamamen ücretsiz
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1 text-blue-500" />
                Anonim
              </span>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-4"
        >
          Neden SuperMatch?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          Güvenli, hızlı ve eğlenceli bir şekilde dünya çapında yeni insanlarla tanışın
        </motion.p>
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card max-w-3xl mx-auto text-center bg-gradient-to-r from-primary-500 to-accent-500 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgNjBMMzAgMzB6TTYwIDYwTDMwIDMweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-30"></div>
          <div className="relative z-10">
            <motion.h2
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              className="text-4xl font-bold text-white mb-4"
            >
              Hemen Başlayın
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/90 mb-8"
            >
              Binlerce insan şu an seni bekliyor!
            </motion.p>
            <Link href="/chat">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 hover:bg-gray-100 font-bold text-lg px-8 py-4 rounded-lg transition-all duration-200 shadow-xl hover:shadow-2xl"
              >
                Ücretsiz Başla
                <motion.span
                  className="inline-block ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold gradient-text mb-3">SuperMatch</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Dünyanın en güvenli ve eğlenceli rastgele video sohbet platformu. Yeni insanlarla tanış, arkadaşlıklar kur!
              </p>
              <div className="flex space-x-4">
                <motion.a
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  href="#"
                  className="w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Globe className="w-5 h-5" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  href="#"
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  href="#"
                  className="w-10 h-10 bg-accent-600 hover:bg-accent-700 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Video className="w-5 h-5" />
                </motion.a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Platform</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Hakkımızda</Link></li>
                <li><Link href="/premium" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Premium</Link></li>
                <li><Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Kariyer</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Destek</h4>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Yardım Merkezi</Link></li>
                <li><Link href="/safety" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Güvenlik</Link></li>
                <li><Link href="/community" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Topluluk</Link></li>
                <li><Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">İletişim</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
                © 2026 SuperMatch. Tüm hakları saklıdır.
              </p>
              <div className="flex space-x-6 text-sm">
                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Gizlilik</Link>
                <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Şartlar</Link>
                <Link href="/cookies" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Çerezler</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, rotate: 1 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="card text-center hover:shadow-2xl hover:border-2 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <motion.div
          className="flex justify-center mb-4"
          whileHover={{ scale: 1.2, rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
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
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -10 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="text-center relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
      <div className="relative z-10">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg"
        >
          {number}
        </motion.div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </motion.div>
  );
}
