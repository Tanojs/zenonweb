import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll"; 
import { ThemeProvider } from "@/components/theme-provider"; // <-- Import ThemeProvider milikmu

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TanoPedia - Panel WhatsApp & Script Bot Premium",
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
  themeColor: "#0c0c1e", // Sesuaikan dengan warna dasar Tano Pedia
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Catatan: Tulisan bg-[#0d0d0d] di sini dihapus agar tidak mengunci warna hitam pekat kaku
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* WAJIB: Membungkus aplikasi dengan ThemeProvider agar tombol tema di navbar berfungsi */}
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem={false}
        >
          {/* Bungkus children di sini biar semua halaman jadi smooth */}
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
