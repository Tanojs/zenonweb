import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "WA Panel Store - Panel WhatsApp & Script Bot Premium",
  description:
    "Beli produk premium panel WhatsApp dan script bot WA untuk kebutuhan bisnis Anda. Harga murah, proses cepat, support 24/7.",
  keywords: [
    "panel whatsapp",
    "script bot wa",
    "bot whatsapp",
    "broadcast wa",
    "auto reply whatsapp",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="bg-[#0d0d0d]">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
