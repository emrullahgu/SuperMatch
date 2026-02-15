import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SuperMatch - Rastgele Video Chat',
  description: 'Dünyanın her yerinden yeni insanlarla rastgele video chat yapın. Omegle, Azar benzeri modern platform.',
  keywords: 'video chat, rastgele sohbet, omegle, azar, chatroulette, yeni arkadaşlar',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
