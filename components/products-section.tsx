Ini coba benerin products-section
"use client";

import { useState, useEffect } from "react";
import { Server } from "lucide-react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Category = "semua" | "panel" | "script" | "app";

export interface Product {
  id: number;
  name: string;
  type: string; // "panel" | "script" | "app"
  price: number;
  features: string[]; // array dari database
  is_ready: boolean;
  stock: number;
  created_at: string;
  // Opsional: tambahkan image_url nanti
}

const categories = [
  { id: "semua", label: "Semua" },
  { id: "panel", label: "Panel" },
  { id: "script", label: "Script" },
  { id: "app", label: "App" },
];

// Mapping badge & warna berdasarkan type
const getBadge = (type: string) => {
  switch (type) {
    case "panel": return { label: "PANEL", color: "bg-[#6C3CE1]" };
    case "script": return { label: "SCRIPT", color: "bg-purple-600" };
    case "app": return { label: "APP", color: "bg-[#6C3CE1]" };
    default: return { label: "PRODUK", color: "bg-gray-600" };
  }
};

function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

export function ProductsSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("semua");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id");

      if (error) {
        console.error("Gagal fetch produk:", error);
        setProducts([]);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (activeCategory === "semua") return true;
    return product.type === activeCategory;
  });

  // Tampilkan loading
  if (loading) {
    return (
      <section className="py-8 bg-background text-foreground px-3 sm:px-6">
        <div className="max-w-6xl mx-auto text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#6C3CE1] border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Memuat produk...</p>
        </div>
      </section>
    );
  }

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
          {filteredProducts.map((product) => {
            const badge = getBadge(product.type);
            const isOutOfStock = product.stock <= 0;

            return (
              <div 
                key={product.id}
                className={`bg-card border border-border/70 rounded-[24px] p-3 shadow-md transition-all hover:-translate-y-1 duration-300 flex flex-col h-full text-center group ${
                  isOutOfStock ? "opacity-60 grayscale" : "hover:border-[#6C3CE1]/40"
                }`}
              >
                {/* Wadah Persegi */}
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

                  {/* Badge HOT (jika is_ready) */}
                  {product.is_ready && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-gradient-to-r from-[#f43f5e] to-[#e11d48] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">HOT</span>
                    </div>
                  )}

                  {/* Badge Kategori */}
                  <div className="absolute top-2 right-2">
                    <span className={`${badge.color} text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-[0.5px]`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Indikator Stok Habis */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-[18px]">
                      <span className="text-white font-bold text-xs bg-red-600 px-3 py-1 rounded-full">STOK HABIS</span>
                    </div>
                  )}
                </div>

                {/* Informasi Konten */}
                <div className="flex flex-col justify-between flex-1 px-1">
                  <div className="mb-2.5">
                    <h3 className="font-bold text-foreground text-sm group-hover:text-[#6C3CE1] transition-colors line-clamp-1 leading-snug">
                      {product.name}
                    </h3>
                    <div className="text-[#6C3CE1] dark:text-purple-400 font-extrabold text-sm sm:text-base mt-1.5 border-t border-border/40 pt-1.5">
                      {formatPrice(product.price)}
                    </div>
                    {/* Tampilkan stok (opsional) */}
                    {!isOutOfStock && (
                      <div className="text-[10px] text-muted-foreground mt-1">
                        Stok: {product.stock}
                      </div>
                    )}
                  </div>

                  {/* Tombol Beli / Habis */}
                  {isOutOfStock ? (
                    <button
                      disabled
                      className="w-full bg-gray-400 text-white text-[11px] font-bold py-2 rounded-xl block uppercase tracking-wide cursor-not-allowed"
                    >
                      Habis
                    </button>
                  ) : (
                    <Link
                      href={`/checkout?id=${product.id}`}
                      className="w-full bg-gradient-to-r from-[#6C3CE1] to-[#a855f7] text-white text-[11px] font-bold py-2 rounded-xl text-center active:scale-95 transition-all block shadow-md shadow-[#6C3CE1]/15 uppercase tracking-wide cursor-pointer"
                    >
                      Beli
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Tidak ada produk dalam kategori ini.</p>
          </div>
        )}

      </div>
    </section>
  );
}