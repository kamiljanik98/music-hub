import UserProvider from '@/providers/UserProvider';
import SupabaseProvider from '@/providers/SupabaseProvider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Music Hub',
  description: 'Place for music producers to share their work',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <SupabaseProvider>
        <UserProvider>
          <body className={`${inter.variable} antialiased`}>{children}</body>
        </UserProvider>
      </SupabaseProvider>
    </html>
  );
}
