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
  type: string;
  price: number;
  is_ready: boolean;
  stock: number;
  image_url: string | null; // <-- Pastikan ada field ini
}

const categories = [
  { id: "semua", label: "Semua" },
  { id: "panel", label: "Panel" },
  { id: "script", label: "Script" },
  { id: "app", label: "App" },
];

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
      // Fetch data dengan mengambil image_url
      const { data, error } = await supabase
        .from("products")
        .select("id, name, type, price, stock, is_ready, image_url")
        .order("id");

      if (error) {
        console.error("Gagal fetch produk:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => activeCategory === "semua" || p.type === activeCategory);

  if (loading) {
    return (
      <section className="py-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#6C3CE1] border-t-transparent"></div>
      </section>
    );
  }

  return (
    <section id="products" className="py-8 bg-background px-3 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as Category)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat.id ? "bg-gradient-to-r from-[#6C3CE1] to-[#a855f7] text-white" : "bg-card border text-muted-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product) => {
            const badge = getBadge(product.type);
            const isOutOfStock = product.stock <= 0;

            return (
              <div key={product.id} className="bg-card border rounded-[24px] p-3 shadow-md flex flex-col h-full text-center">
                {/* Bagian Gambar */}
                <div className="relative aspect-square w-full bg-zinc-200 dark:bg-zinc-800 rounded-[18px] overflow-hidden mb-3 flex items-center justify-center">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Server className="w-10 h-10 text-[#6C3CE1]" />
                  )}
                  
                  {product.is_ready && (
                    <div className="absolute top-2 left-2"><span className="bg-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">HOT</span></div>
                  )}
                  <div className="absolute top-2 right-2"><span className={`${badge.color} text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase`}>{badge.label}</span></div>
                </div>

                <div className="flex flex-col flex-1 px-1">
                  <h3 className="font-bold text-sm line-clamp-1">{product.name}</h3>
                  <div className="text-[#6C3CE1] font-extrabold text-sm mt-1.5">{formatPrice(product.price)}</div>
                  
                  <Link
                    href={`/checkout?id=${product.id}`}
                    className={`w-full mt-3 py-2 rounded-xl text-[11px] font-bold text-white text-center uppercase ${isOutOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-[#6C3CE1] to-[#a855f7]"}`}
                  >
                    {isOutOfStock ? "Habis" : "Beli"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
