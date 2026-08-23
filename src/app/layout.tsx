import type { Metadata } from "next";
import { DM_Sans, Anton } from "next/font/google";
import "./globals.css";

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
    <html
      lang="en"
      className={`${dmSans.variable} ${anton.variable} antialiased`}
    >
      <body className="relative flex min-h-screen flex-col overflow-x-clip bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
