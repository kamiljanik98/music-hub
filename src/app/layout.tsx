import type { Metadata, Viewport } from "next";
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
  title: "Music Hub",
  description: "Publish and listen to original music.",
  applicationName: "Music Hub",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
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
      <body className="relative flex min-h-screen flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
