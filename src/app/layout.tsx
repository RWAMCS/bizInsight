import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { PWARegister } from "@/components/pwa-register" // Import ini

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BizInsight - Smart POS",
  description: "Kelola bisnis Anda dengan mudah",
  manifest: "/manifest.webmanifest", // Pastikan manifest terpanggil
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PWARegister /> {/* Daftarkan SW di sini */}
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}