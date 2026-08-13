import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import Navbar from "@/components/common/navbar";
import AuthModal from "@/components/auth/auth-dialog";
import { Bar } from "@/components/player/bar";
import { UserProvider } from "@/components/providers/user-provider";
import Footer from "@/components/common/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "MusicHub",
  description: "Share your sounds with the world",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar />
        <div className="mx-auto w-full max-w-6xl flex-1">
          <UserProvider />
          <Toaster
            position="top-center"
            toastOptions={{
              classNames: {
                success: "!bg-neutral-950 !border-green-800 !text-green-300",
                error: "!bg-red-950 !border-red-800 !text-red-300",
              },
            }}
          />
          <AuthModal />
          {children}
        </div>
        <Footer />
        <Bar />
      </body>
    </html>
  );
}
