'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Chrome, Github, Mail, Lock, User, Calendar, MapPin, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle, signInWithGithub } = useAuthStore();
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState<number>(18);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('other');
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success('Başarıyla giriş yaptınız!');
        router.push('/chat');
      } else {
        if (!username || !displayName) {
          toast.error('Lütfen tüm alanları doldurun');
          return;
        }
        
        await signUp(email, password, {
          username,
          display_name: displayName,
          age,
          gender,
          interests,
        });
        
        toast.success('Hesap oluşturuldu! Lütfen email adresinizi doğrulayın.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      toast.error('Google ile giriş başarısız');
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signInWithGithub();
    } catch (error: any) {
      toast.error('Github ile giriş başarısız');
    }
  };

  const addInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Toaster position="top-center" />
      
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <div className="flex justify-center mb-4">
              <Image 
                src="/logo/supermatchlogo.png" 
                alt="SuperMatch Logo" 
                width={200}
                height={80}
                className="cursor-pointer"
              />
            </div>
          </Link>
          <h1 className="text-3xl font-bold mb-2">
            {isLogin ? 'Hoş Geldiniz' : 'Hesap Oluşturun'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isLogin ? 'Hesabınıza giriş yapın' : 'Yeni arkadaşlar edinmeye başlayın'}
          </p>
        </div>

        <div className="card">
          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Chrome className="w-5 h-5" />
              <span>Google ile devam et</span>
            </button>
            
            <button
              onClick={handleGithubSignIn}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>Github ile devam et</span>
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                veya email ile
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <User className="inline w-4 h-4 mr-2" />
                    Kullanıcı Adı
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field"
                    placeholder="kullaniciadi"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Görünen İsim
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="input-field"
                    placeholder="İsim Soyisim"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Calendar className="inline w-4 h-4 mr-2" />
                      Yaş
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value))}
                      className="input-field"
                      min="18"
                      max="99"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Cinsiyet
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="input-field"
                    >
                      <option value="male">Erkek</option>
                      <option value="female">Kadın</option>
                      <option value="other">Diğer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Heart className="inline w-4 h-4 mr-2" />
                    İlgi Alanları
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                      className="input-field flex-1"
                      placeholder="Müzik, Spor, Oyun..."
                    />
                    <button
                      type="button"
                      onClick={addInterest}
                      className="px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Ekle
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <span
                        key={interest}
                        className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-3 py-1 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                <Mail className="inline w-4 h-4 mr-2" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="ornek@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Lock className="inline w-4 h-4 mr-2" />
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Yükleniyor...' : isLogin ? 'Giriş Yap' : 'Hesap Oluştur'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-600 hover:text-primary-700 text-sm"
            >
              {isLogin ? 'Hesabınız yok mu? Kayıt olun' : 'Zaten hesabınız var mı? Giriş yapın'}
            </button>
          </div>

          {!isLogin && (
            <p className="mt-4 text-xs text-gray-500 text-center">
              Kayıt olarak{' '}
              <Link href="/terms" className="text-primary-600 hover:underline">
                Kullanım Şartları
              </Link>{' '}
              ve{' '}
              <Link href="/privacy" className="text-primary-600 hover:underline">
                Gizlilik Politikası
              </Link>
              'nı kabul etmiş olursunuz.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
