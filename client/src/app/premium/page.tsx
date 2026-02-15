'use client';

import { useState } from 'react';
import { Crown, Check, Zap, Star, Shield, Filter, SkipForward, History } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { createCheckoutSession, redirectToCheckout } from '@/lib/stripe';

export default function PremiumPage() {
  const { user, profile } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (plan: 'monthly' | 'yearly') => {
    if (!user) {
      router.push('/auth');
      return;
    }

    setLoading(true);
    try {
      const priceId = plan === 'monthly' 
        ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID 
        : process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID;

      const session = await createCheckoutSession(user.id, priceId!);
      await redirectToCheckout(session.id);
    } catch (error) {
      toast.error('Ödeme işlemi başlatılamadı');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Filter className="w-6 h-6" />,
      title: 'Gelişmiş Filtreler',
      description: 'Cinsiyet, yaş, konum ve ilgi alanlarına göre detaylı filtreleme',
    },
    {
      icon: <SkipForward className="w-6 h-6" />,
      title: 'Sınırsız Skip',
      description: 'İstediğiniz kadar kullanıcı değiştirin, limit yok',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Öncelikli Eşleşme',
      description: 'Daha hızlı eşleşme ve öncelikli kullanım',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Doğrulanmış Rozet',
      description: 'Profilinizde premium rozeti görünsün',
    },
    {
      icon: <History className="w-6 h-6" />,
      title: 'Geçmiş Eşleşmeler',
      description: 'Önceki sohbetlerinizi ve eşleşmelerinizi görün',
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Reklamsız Deneyim',
      description: 'Hiç reklam olmadan kesintisiz sohbet',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image 
              src="/logo/supermatchlogo.png" 
              alt="SuperMatch" 
              width={150}
              height={50}
            />
          </Link>
          <Link href="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            ← Geri Dön
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-6">
          <Crown className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          <span className="gradient-text">Premium</span> Ol
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Daha fazla özellik, daha iyi deneyim. SuperMatch Premium ile tanışma deneyiminizi bir üst seviyeye taşıyın.
        </p>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="card hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Planınızı Seçin
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Monthly Plan */}
            <div className="card border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Aylık</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold">₺49</span>
                  <span className="text-gray-600 dark:text-gray-400">/ay</span>
                </div>
                
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Tüm Premium özellikler</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>İstediğiniz zaman iptal edin</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>7 gün para iade garantisi</span>
                  </li>
                </ul>

                <button
                  onClick={() => handleUpgrade('monthly')}
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? 'Yükleniyor...' : 'Aylık Başla'}
                </button>
              </div>
            </div>

            {/* Yearly Plan - Popular */}
            <div className="card border-2 border-yellow-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  En Popüler - %40 İndirim
                </span>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Yıllık</h3>
                <div className="mb-2">
                  <span className="text-5xl font-bold">₺349</span>
                  <span className="text-gray-600 dark:text-gray-400">/yıl</span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 mb-6">
                  Aylık sadece ₺29 - ₺240 tasarruf!
                </p>
                
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Tüm Premium özellikler</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>İstediğiniz zaman iptal edin</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>7 gün para iade garantisi</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="font-semibold text-yellow-600">2 ay ücretsiz!</span>
                  </li>
                </ul>

                <button
                  onClick={() => handleUpgrade('yearly')}
                  disabled={loading}
                  className="btn-primary w-full bg-yellow-600 hover:bg-yellow-700"
                >
                  {loading ? 'Yükleniyor...' : 'Yıllık Başla - En İyi Fiyat'}
                </button>
              </div>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900 px-6 py-3 rounded-full">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-green-800 dark:text-green-200 font-semibold">
                7 Gün Para İade Garantisi
              </span>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
              Memnun kalmazsanız, ilk 7 gün içinde tam para iadesi yapıyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Sık Sorulan Sorular
          </h2>

          <div className="space-y-6">
            <FAQItem
              question="Premium üyeliği nasıl iptal edebilirim?"
              answer="Hesap ayarlarınızdan istediğiniz zaman üyeliğinizi iptal edebilirsiniz. İptal ettiğinizde mevcut dönem sonuna kadar premium özelliklerden yararlanmaya devam edersiniz."
            />
            <FAQItem
              question="Hangi ödeme yöntemlerini kabul ediyorsunuz?"
              answer="Kredi kartı, banka kartı ve çeşitli dijital ödeme yöntemlerini (Apple Pay, Google Pay) kabul ediyoruz. Tüm ödemeler Stripe güvenlik sistemi ile korunmaktadır."
            />
            <FAQItem
              question="Premium özellikler hemen aktif oluyor mu?"
              answer="Evet! Ödemeniz onaylandıktan hemen sonra tüm premium özelliklere anında erişebilirsiniz."
            />
            <FAQItem
              question="Yıllık plandan aylık plana geçebilir miyim?"
              answer="Evet, üyelik dönemleriniz arasında plan değişikliği yapabilirsiniz. Mevcut planınız bittiğinde yeni planınız başlar."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>Sorularınız mı var? <Link href="/contact" className="text-primary-600 hover:underline">Bize ulaşın</Link></p>
        </div>
      </footer>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="card cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-lg pr-4">{question}</h3>
        <span className="text-2xl flex-shrink-0">{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && (
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          {answer}
        </p>
      )}
    </div>
  );
}
