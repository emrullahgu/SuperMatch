'use client';

import { useEffect, useState } from 'react';
import { Video, MessageCircle, Users, Shield, Zap, Globe } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    // Simulated online users counter
    const interval = setInterval(() => {
      setOnlineUsers(Math.floor(Math.random() * 5000) + 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Video className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl font-bold gradient-text">SuperMatch</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
              {onlineUsers.toLocaleString()} çevrimiçi
            </span>
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
        <div className="card max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem number="1M+" label="Kullanıcı" />
            <StatItem number="50M+" label="Eşleşme" />
            <StatItem number="180+" label="Ülke" />
            <StatItem number="24/7" label="Destek" />
          </div>
        </div>
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

function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-4xl font-bold text-primary-600 mb-2">{number}</div>
      <div className="text-gray-600 dark:text-gray-400">{label}</div>
    </div>
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
