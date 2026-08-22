import type { Metadata } from "next";
import { DM_Sans, Anton } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import Navbar from "@/components/common/navbar";
import AuthModal from "@/components/auth/auth-dialog";
import { Bar } from "@/components/player/bar";
import { UserProvider } from "@/components/providers/user-provider";
import Footer from "@/components/common/footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

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
    <html lang="en" className={`${dmSans.variable} ${anton.variable} antialiased`}>
      <body className="relative flex min-h-screen flex-col gap-4 overflow-x-clip bg-background p-4 pb-[116px] text-foreground">
        <div
          aria-hidden
          className="mh-atmosphere-a pointer-events-none absolute -top-20 -right-[10%] -z-10 h-[520px] w-[60%] rounded-full"
        />
        <div
          aria-hidden
          className="mh-atmosphere-b pointer-events-none absolute top-[820px] -left-[6%] -z-10 h-[520px] w-[55%] rounded-full"
        />
        <Navbar />
        <div className="mx-auto w-full max-w-[var(--mh-content-max)] flex-1">
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
