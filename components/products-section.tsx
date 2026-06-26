"use client";

import { useState } from "react";
import { Server } from "lucide-react";
import Link from "next/link";

type Category = "semua" | "panel" | "script" | "app";

export interface Product {
  id: number;
  name: string;
  badge: string;
  badgeColor: string;
  price: number;
  description: string;
  image?: string; 
  isNew?: boolean;
  categoryType: "panel" | "script" | "app";
  features: string[];
}

const categories = [
  { id: "semua", label: "Semua Layanan" },
  { id: "panel", label: "Panel" },
  { id: "script", label: "Script" },
  { id: "app", label: "App" },
];

export const ALL_PRODUCTS: Product[] = [
  {
    id: 201,
    name: "Panel Pterodactyl",
    badge: "PANEL",
    badgeColor: "bg-[#6C3CE1]",
    price: 2000,
    description: "Sewa panel server High Performance kualitas terbaik untuk bot WhatsApp pro dan game server Anda. Garansi penuh dan uptime maksimal.",
    image: "", 
    isNew: true,
    categoryType: "panel",
    features: ["CPU & VPS stabil", "VPS legal", "Anti delay", "Uptime 24/7", "Anti suspend"]
  },
  {
    id: 1,
    name: "Script Zenon JPM",
    badge: "SCRIPT",
    badgeColor: "bg-purple-600",
    price: 15000,
    description: "PRO TEAM PLAN! Script JPM dengan fitur otomatisasi penyiaran pesan terlengkap, tanpa enkripsi, dan aman digunakan.",
    image: "/images/zenon-sc.jpg", 
    isNew: true,
    categoryType: "script",
    features: ["SWGC", "Automation", "Push kontak", "All fitur work", "No enc"]
  },
  {
    id: 101,
    name: "Alight Motion",
    badge: "APP",
    badgeColor: "bg-[#6C3CE1]",
    price: 5000,
    description: "Akun Alight Motion Pro berdurasi 1 tahun full premium tanpa watermark. Bisa pakai semua preset.",
    image: "/images/alightmotion.jpg",
    isNew: true,
    categoryType: "app",
    features: ["Aktif 1 Tahun", "No Watermark", "Bisa pakai semua Preset", "Bergaransi"]
  }
];

function formatDisplayPrice(product: Product): string {
  if (product.id === 201) return "Mulai Rp 2.000";
  return `Rp ${product.price.toLocaleString("id-ID")}`;
}

export function ProductsSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("semua");

  const filteredProducts = ALL_PRODUCTS.filter(product => {
    if (activeCategory === "semua") return true;
    return product.categoryType === activeCategory;
  });

  return (
    <section id="products" className="py-8 bg-background text-foreground px-3 sm:px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigasi Kategori Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as Category)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-[#6C3CE1] to-[#a855f7] text-white shadow-lg shadow-[#6C3CE1]/30"
                  : "bg-card border border-border text-muted-foreground hover:border-[#6C3CE1] hover:text-[#6C3CE1]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Info Total Item */}
        <div className="mb-4 text-center sm:text-left">
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
            {activeCategory === "semua" ? "Semua Layanan" : activeCategory === "panel" ? "Panel Hosting" : activeCategory === "script" ? "Source Code" : "Aplikasi Premium"}{" "}
            <span className="text-[#6C3CE1]">({filteredProducts.length})</span>
          </h2>
        </div>

        {/* Grid Katalog Utama - Mengikuti style premium rata tengah */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="bg-card border border-border/70 rounded-[24px] p-3 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full text-center group"
            >
              {/* Wadah Foto: Putih bersih, padding pas, logo di tengah (Mirip Gambar Kanan) */}
              <div className="relative aspect-square w-full bg-slate-50 dark:bg-zinc-900/40 rounded-[18px] overflow-hidden shrink-0 flex items-center justify-center p-5 mb-3">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-2/3 h-2/3 object-contain rounded-2xl group-hover:scale-[1.05] transition-transform duration-300" 
                  />
                ) : (
                  <Server className="w-10 h-10 text-[#6C3CE1] dark:text-purple-400" />
                )}
                
                {/* Badge Status Tipis Transparan khas modern UI */}
                <div className="absolute top-2 right-2">
                  <span className="bg-purple-600/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300 text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {product.badge}
                  </span>
                </div>
              </div>

              {/* Teks Informasi Rata Tengah (Center Aligned) */}
              <div className="flex flex-col justify-between flex-1 px-1">
                <div className="mb-2">
                  <h3 className="font-bold text-foreground text-[13px] leading-tight group-hover:text-[#6C3CE1] transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="text-[#6C3CE1] dark:text-purple-400 font-black text-xs mt-1">
                    {formatDisplayPrice(product)}
                  </div>
                </div>

                {/* Tombol Beli Minimalis */}
                <Link
                  href={`/checkout?id=${product.id}`}
                  className="w-full bg-[#6C3CE1]/10 text-[#6C3CE1] hover:bg-[#6C3CE1] hover:text-white dark:bg-purple-500/10 dark:text-purple-300 dark:hover:bg-purple-600 dark:hover:text-white text-[11px] font-bold py-1.5 rounded-xl text-center active:scale-95 transition-all block uppercase tracking-wide cursor-pointer mt-1"
                >
                  Beli
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
