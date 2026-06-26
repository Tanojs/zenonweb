"use client";

import { useState } from "react";
import { Check, Code, Server, Smartphone, MessageSquare } from "lucide-react";
import Link from "next/link";

type Category = "semua" | "panel" | "script" | "app";

interface Product {
  id: string | number;
  name: string;
  badge: string;
  badgeColor: string;
  price: string | number;
  description: string;
  image?: string; 
  isNew?: boolean;
  categoryType: "panel" | "script" | "app";
  categoryLabel: string;
  features: string[];
}

const categories = [
  { id: "semua", label: "Semua Produk" },
  { id: "panel", label: "Panel" },
  { id: "script", label: "Script" },
  { id: "app", label: "App" },
];

// 📦 SEMUA PRODUK DIJADIKAN SATU STRUKTUR DATA SAMA PERSIS
const ALL_PRODUCTS: Product[] = [
  {
    id: "panel-pterodactyl",
    name: "Panel Pterodactyl",
    badge: "PANEL",
    badgeColor: "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400",
    price: "Mulai Rp2.000",
    image: "", // Kosongkan jika ingin memakai fallback icon bawaan server
    description: "High Performance Server",
    isNew: true,
    categoryType: "panel",
    categoryLabel: "HOSTING",
    features: ["CPU stabil", "VPS legal & stabil", "Server fast & anti delay", "Uptime 24/7"]
  },
  {
    id: 1,
    name: "Script Zenon JPM",
    badge: "SCRIPT",
    badgeColor: "bg-purple-600 text-white",
    price: 15000,
    image: "/images/zenon-sc.jpg", 
    description: "Script JPM fitur lumayan banyak",
    isNew: true,
    categoryType: "script",
    categoryLabel: "AUTOMATION",
    features: ["SWGC", "Automation", "Push kontak", "All fitur work", "No enc"]
  },
  {
    id: 101,
    name: "Alight Motion",
    badge: "AUTO",
    badgeColor: "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400",
    price: 5000,
    image: "/images/alightmotion.jpg",
    description: "Premium Editing",
    isNew: true,
    categoryType: "app",
    categoryLabel: "DESAIN",
    features: ["Aktif 1 Tahun", "No Watermark", "Bisa pakai semua Preset", "Bergaransi"]
  }
];

function formatDisplayPrice(price: string | number): string {
  if (typeof price === "string") return price;
  return `Rp${price.toLocaleString("id-ID")}`;
}

// 📱 SATU KOMPONEN CARD UNTUK SEMUA JENIS PRODUK
// Bentuk kotak simetris rata tengah 100% meniru Premiumku (Gambar 1001756005.jpg)
function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-card border border-border/60 rounded-[24px] p-3 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full text-center relative group">
      
      {/* Wadah Gambar Kotak Sempurna (Aspect Square) */}
      <div className="relative aspect-square w-full bg-zinc-50 dark:bg-zinc-900/50 rounded-[18px] overflow-hidden flex items-center justify-center p-6 shrink-0 mb-3">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-contain rounded-[14px] group-hover:scale-[1.04] transition-transform duration-300"
          />
        ) : (
          /* Fallback Icon default jika tidak ada file gambar */
          <Server className="w-14 h-14 text-[#6C3CE1] dark:text-purple-400 group-hover:scale-[1.05] transition-transform duration-300" />
        )}
        
        {/* Badge di Pojok Kanan Atas */}
        <div className="absolute top-2.5 right-2.5">
          <span className={`${product.badgeColor} text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm`}>
            {product.badge}
          </span>
        </div>

        {/* Badge Hot di Pojok Kiri Atas */}
        {product.isNew && (
          <div className="absolute top-2.5 left-2.5">
            <span className="bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              HOT
            </span>
          </div>
        )}
      </div>

      {/* Area Teks Informasi Rata Tengah */}
      <div className="flex flex-col flex-1 px-1 justify-between">
        <div className="mb-3">
          <span className="text-[10px] text-[#6C3CE1] dark:text-purple-400 font-extrabold tracking-widest uppercase block mb-0.5">
            {product.categoryLabel}
          </span>
          <h3 className="font-extrabold text-foreground text-[15px] leading-tight mb-1 group-hover:text-[#6C3CE1] dark:group-hover:text-purple-400 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[11px] font-medium text-muted-foreground line-clamp-1">
            {product.description}
          </p>
        </div>

        {/* Harga & Tombol Aksi Bersyarat */}
        <div className="pt-2.5 border-t border-border/50 mt-auto">
          <div className="text-foreground font-black text-[15px] mb-2">
            {formatDisplayPrice(product.price)}
          </div>

          {product.categoryType === "panel" ? (
            /* Jika kategori Panel -> Arahkan langsung ke Telegram */
            <a
              href="https://t.me/username_tele_kamu" // <-- GANTI USERNAME TELEGRAM KAMU DI SINI
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white text-[12px] font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Order via Tele
            </a>
          ) : (
            /* Jika Kategori Script/App -> Masuk ke Checkout Web */
            <Link
              href={`/checkout?type=${product.categoryType}&id=${product.id}&name=${encodeURIComponent(product.name)}&price=${product.price}`}
              className="w-full bg-[#6C3CE1]/10 text-[#6C3CE1] hover:bg-[#6C3CE1] hover:text-white dark:bg-[#6C3CE1]/20 dark:text-purple-300 dark:hover:bg-[#6C3CE1] dark:hover:text-white text-[12px] font-bold py-2 rounded-xl transition-all block text-center active:scale-95 cursor-pointer"
            >
              Beli Sekarang
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductsSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("semua");

  // Memfilter produk berdasarkan navigasi tab aktif
  const filteredProducts = ALL_PRODUCTS.filter(product => {
    if (activeCategory === "semua") return true;
    return product.categoryType === activeCategory;
  });

  return (
    <section id="products" className="py-8 bg-background text-foreground px-3 sm:px-6 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigasi Kategori (Tab Utama) */}
        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-1 no-scrollbar justify-start sm:justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as Category)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-[#6C3CE1] to-[#a855f7] text-white shadow-md shadow-[#6C3CE1]/20"
                  : "bg-card border border-border/60 text-muted-foreground hover:border-[#6C3CE1] hover:text-[#6C3CE1]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Label Judul Section Aktif */}
        <div className="mb-5">
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
            {activeCategory === "semua"
              ? "Semua Layanan"
              : activeCategory === "panel"
                ? "Panel Hosting"
                : activeCategory === "script"
                  ? "Source Code"
                  : "Aplikasi Premium"}{" "}
            <span className="text-[#6C3CE1]">({filteredProducts.length})</span>
          </h2>
        </div>

        {/* Grid Utama: Menampilkan seluruh item secara rapi dan seragam sejajar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
