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
    description: "Panel yang di buat menggunakan vps legal jadi awet 1 bulan full.",
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
    description: "Source code jpm yang memiliki banyak fitur diantaranya ada swgc, pushkontak, jpm dll.",
    image: "/images/zenon-sc.jpg", 
    isNew: true,
    categoryType: "script",
    features: ["SWGC", "Automation", "Push kontak", "All fitur work", "No enc"]
  },
  {
    id: 101,
    name: "ALIGHT MOTION PREMIUM",
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

        {/* Grid Katalog Utama */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="bg-card border border-border/70 rounded-[24px] p-3 shadow-md hover:border-[#6C3CE1]/40 transition-all hover:-translate-y-1 duration-300 flex flex-col h-full text-center group"
            >
              {/* Wadah Persegi (Fotonya di-full-kan tanpa padding berlebih) */}
              <div className="relative aspect-square w-full bg-zinc-200 dark:bg-zinc-800 rounded-[18px] overflow-hidden shrink-0 flex items-center justify-center mb-3">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" 
                  />
                ) : (
                  <Server className="w-10 h-10 text-[#6C3CE1] dark:text-purple-400" />
                )}
                
                {/* Badge HOT */}
                <div className="absolute top-2 left-2">
                  {product.isNew && (
                    <span className="bg-gradient-to-r from-[#f43f5e] to-[#e11d48] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">HOT</span>
                  )}
                </div>

                {/* Badge Kategori */}
                <div className="absolute top-2 right-2">
                  <span className="bg-[#6C3CE1] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-[0.5px]">
                    {product.badge}
                  </span>
                </div>
              </div>

              {/* Informasi Konten Rata Tengah */}
              <div className="flex flex-col justify-between flex-1 px-1">
                <div className="mb-2.5">
                  <h3 className="font-bold text-foreground text-sm group-hover:text-[#6C3CE1] transition-colors line-clamp-1 leading-snug">
                    {product.name}
                  </h3>
                  <div className="text-[#6C3CE1] dark:text-purple-400 font-extrabold text-sm sm:text-base mt-1.5 border-t border-border/40 pt-1.5">
                    {formatDisplayPrice(product)}
                  </div>
                </div>

                {/* Tombol Ungu Gradasi Solid Kesukaanmu */}
                <Link
                  href={`/checkout?id=${product.id}`}
                  className="w-full bg-gradient-to-r from-[#6C3CE1] to-[#a855f7] text-white text-[11px] font-bold py-2 rounded-xl text-center active:scale-95 transition-all block shadow-md shadow-[#6C3CE1]/15 uppercase tracking-wide cursor-pointer"
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
