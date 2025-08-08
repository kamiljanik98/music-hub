import UserProvider from "@/providers/UserProvider";
import SupabaseProvider from "@/providers/SupabaseProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import UploadModal from "@/modules/upload/ui/components/upload-modal";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Music Hub",
  description: "Place for music producers to share their work",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="overflow-hidden">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#050505" />
      </Head>
      <body className={`${inter.variable} antialiased overflow-hidden`}>
        <SupabaseProvider>
          <UserProvider>
            <UploadModal />
            {children}
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
