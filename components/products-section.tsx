"use client";

import { useState } from "react";
import { Server, Code, Smartphone } from "lucide-react";
import Link from "next/link";

type Category = "semua" | "panel" | "script" | "app";

interface Product {
  id: number;
  name: string;
  badge: string;
  badgeColor: string;
  price: number;
  image?: string; 
  isNew?: boolean;
  categoryType: "panel" | "script" | "app";
}

const categories = [
  { id: "semua", label: "Semua Layanan" },
  { id: "panel", label: "Panel" },
  { id: "script", label: "Script" },
  { id: "app", label: "App" },
];

// DATABASE PUSAT: Samakan ID-nya dengan yang ada di checkout/page.tsx
const ALL_PRODUCTS: Product[] = [
  {
    id: 201,
    name: "Panel Pterodactyl",
    badge: "PANEL",
    badgeColor: "bg-[#6C3CE1]",
    price: 2000,
    image: "", // Kosongkan jika ingin memakai fallback icon default Server
    isNew: true,
    categoryType: "panel"
  },
  {
    id: 1,
    name: "Script Zenon JPM",
    badge: "SCRIPT",
    badgeColor: "bg-purple-600",
    price: 15000,
    image: "/images/zenon-sc.jpg", 
    isNew: true,
    categoryType: "script"
  },
  {
    id: 101,
    name: "ALIGHT MOTION PREMIUM",
    badge: "APP",
    badgeColor: "bg-[#6C3CE1]",
    price: 5000,
    image: "/images/alightmotion.jpg",
    isNew: true,
    categoryType: "app"
  }
];

function formatDisplayPrice(product: Product): string {
  if (product.id === 201) return "Mulai Rp 2.000";
  return `Rp ${product.price.toLocaleString("id-ID")}`;
}

export function ProductsSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("semua");

  // Memfilter produk berdasarkan tab kategori aktif
  const filteredProducts = ALL_PRODUCTS.filter(product => {
    if (activeCategory === "semua") return true;
    return product.categoryType === activeCategory;
  });

  return (
    <section id="products" className="py-8 bg-background text-foreground px-3 sm:px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigasi Kategori Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
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
        <div className="mb-6">
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

        {/* Grid Katalog Utama (Hanya Logo, Nama, Harga + Tombol ke Checkout) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="bg-card border border-border rounded-[20px] overflow-hidden shadow-md hover:border-[#6C3CE1]/40 transition-all hover:-translate-y-1 p-[12px] duration-300 flex flex-col h-full group"
            >
              {/* Wadah Gambar/Logo */}
              <div className="relative h-[110px] w-full bg-zinc-200 dark:bg-zinc-800 rounded-[14px] overflow-hidden shrink-0 flex items-center justify-center">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  /* Fallback Icon bawaan server jika tidak ada gambar */
                  <Server className="w-10 h-10 text-[#6C3CE1]" />
                )}
                
                {/* Badge Status */}
                <div className="absolute top-2 left-2">
                  {product.isNew && (
                    <span className="bg-gradient-to-r from-[#f43f5e] to-[#e11d48] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">HOT</span>
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`${product.badgeColor} text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-sm uppercase`}>
                    {product.badge}
                  </span>
                </div>
              </div>

              {/* Teks Informasi & Tombol Navigasi Langsung */}
              <div className="pt-2.5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-bold text-foreground text-sm group-hover:text-[#6C3CE1] dark:group-hover:text-purple-400 transition-colors line-clamp-1 leading-snug">
                    {product.name}
                  </h3>
                  <div className="text-[#6C3CE1] dark:text-purple-400 font-extrabold text-sm sm:text-base mt-1.5 border-t border-border/40 pt-1.5 mb-2.5">
                    {formatDisplayPrice(product)}
                  </div>
                </div>

                {/* Tombol Melempar Data ID ke Halaman Checkout */}
                <Link
                  href={`/checkout?id=${product.id}`}
                  className="w-full bg-gradient-to-r from-[#6C3CE1] to-[#a855f7] text-white text-[11px] font-bold py-2 rounded-xl text-center active:scale-95 transition-all block shadow-sm shadow-[#6C3CE1]/15 uppercase tracking-wide cursor-pointer"
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
