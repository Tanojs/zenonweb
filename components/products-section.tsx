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
  image_url?: string; // Gunakan image_url sesuai nama kolom di database
}

// ... (Kategori & getBadge tetap sama)

export function ProductsSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("semua");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      // Pastikan image_url di-select!
      const { data, error } = await supabase
        .from("products")
        .select("id, name, type, price, is_ready, stock, image_url")
        .order("id");

      if (error) {
        console.error("Gagal fetch:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // ... (filteredProducts & loading state tetap sama)

  return (
    <section id="products" className="py-8 bg-background px-3 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* ... (Kategori Tabs) ... */}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredProducts.map((product) => {
            const badge = getBadge(product.type);
            const isOutOfStock = product.stock <= 0;

            return (
              <div key={product.id} className="bg-card border rounded-[24px] p-3 shadow-md flex flex-col h-full text-center group">
                
                {/* FIX LAYOUT SHIFT: Container punya aspect-square tetap */}
                <div className="relative aspect-square w-full bg-zinc-200 dark:bg-zinc-800 rounded-[18px] overflow-hidden mb-3 flex items-center justify-center shrink-0">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      // Tambahkan loading lazy dan ukuran agar browser tidak "melompat"
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" 
                    />
                  ) : (
                    <Server className="w-10 h-10 text-[#6C3CE1]" />
                  )}
                  
                  {/* ... (Badges tetap sama) ... */}
                </div>

                {/* ... (Informasi Konten & Tombol) ... */}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
