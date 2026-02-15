import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SuperMatch - Rastgele Video Chat | Yeni İnsanlarla Tanış',
  description: 'Dünyanın her yerinden yeni insanlarla rastgele video chat yapın. Güvenli, hızlı ve eğlenceli tanışma platformu.',
  keywords: 'video chat, rastgele sohbet, omegle, azar, chatroulette, yeni arkadaşlar, online sohbet, görüntülü konuşma',
  authors: [{ name: 'SuperMatch' }],
  creator: 'SuperMatch',
  publisher: 'SuperMatch',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SuperMatch - Rastgele Video Chat',
    description: 'Yeni insanlarla tanış, eğlenceli sohbetler yap!',
    url: '/',
    siteName: 'SuperMatch',
    images: [
      {
        url: '/logo/supermatchlogo.png',
        width: 1200,
        height: 630,
        alt: 'SuperMatch Logo',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SuperMatch - Rastgele Video Chat',
    description: 'Yeni insanlarla tanış, eğlenceli sohbetler yap!',
    images: ['/logo/supermatchlogo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SuperMatch',
  },
};

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SuperMatch" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}
