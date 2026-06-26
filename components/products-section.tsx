"use client";

import { useState } from "react";
import { Check, Code, Server, Smartphone, MessageSquare } from "lucide-react";
import Link from "next/link";

type Category = "semua" | "panel" | "script" | "app";

interface Script {
  id: number;
  name: string;
  badge: string;
  badgeColor: string;
  price: number;
  description: string;
  image?: string; 
  isNew?: boolean;
  categoryName: string;
}

const categories = [
  { id: "semua", label: "Semua Produk" },
  { id: "panel", label: "Panel" },
  { id: "script", label: "Script" },
  { id: "app", label: "App" },
];

const scripts: Script[] = [
  {
    id: 1,
    name: "Script Zenon JPM",
    badge: "SCRIPT",
    badgeColor: "bg-[#6C3CE1] text-white",
    price: 15000,
    image: "/images/zenon-sc.jpg", 
    description: "Script JPM fitur lumayan banyak",
    isNew: true,
    categoryName: "AUTOMATION"
  }
];

const apps: Script[] = [
  {
    id: 101,
    name: "Alight Motion",
    badge: "AUTO",
    badgeColor: "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400",
    price: 5000,
    image: "/images/alightmotion.jpg",
    description: "Premium Editing",
    isNew: true,
    categoryName: "DESAIN"
  }
];

const panelFeatures = [
  "CPU & VPS Legal Stabil",
  "Server Fast Anti Delay",
  "Uptime 24/7 Anti Suspend",
  "Garansi Aktif 20 Hari",
];

function formatPrice(price: number): string {
  return `Rp${price.toLocaleString("id-ID")}`;
}

// 📱 PRODUCT CARD: Bentuk 100% Mengikuti Premiumku (Rata Tengah + Foto Kotak Sempurna)
// Warna otomatis beradaptasi dengan mode gelap/terang
function ProductCard({ item, type }: { item: Script; type: "script" | "app" }) {
  return (
    <div className="bg-card border border-border/60 rounded-[24px] p-3 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full text-center relative group">
      
      {/* Wadah Foto Kotak Sempurna (Aspect Square) - Menyesuaikan tema gelap/terang */}
      <div className="relative aspect-square w-full bg-zinc-50 dark:bg-zinc-900/50 rounded-[18px] overflow-hidden flex items-center justify-center p-6 shrink-0 mb-3">
        <img 
          src={item.image || "/placeholder-script.jpg"} 
          alt={item.name}
          className="w-full h-full object-contain rounded-[14px] group-hover:scale-[1.04] transition-transform duration-300"
        />
        
        {/* Posisi Badge Sesuai Referensi Gambar */}
        <div className="absolute top-2.5 right-2.5">
          <span className={`${item.badgeColor} text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm`}>
            {item.badge}
          </span>
        </div>
        {item.isNew && (
          <div className="absolute top-2.5 left-2.5">
            <span className="bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              HOT
            </span>
          </div>
        )}
      </div>

      {/* Konten Teks Rata Tengah */}
      <div className="flex flex-col flex-1 px-1 justify-between">
        <div className="mb-3">
          <span className="text-[10px] text-[#6C3CE1] dark:text-purple-400 font-extrabold tracking-widest uppercase block mb-0.5">
            {item.categoryName}
          </span>
          <h3 className="font-extrabold text-foreground text-[15px] leading-tight mb-1 group-hover:text-[#6C3CE1] dark:group-hover:text-purple-400 transition-colors line-clamp-1">
            {item.name}
          </h3>
          <p className="text-[11px] font-medium text-muted-foreground line-clamp-1">
            {item.description}
          </p>
        </div>

        {/* Harga & Tombol Aksi */}
        <div className="pt-2.5 border-t border-border/50 mt-auto">
          <div className="text-foreground font-black text-[15px] mb-2">
            {formatPrice(item.price)}
          </div>
          <Link
            href={`/checkout?type=${type}&id=${item.id}&name=${encodeURIComponent(item.name)}&price=${item.price}`}
            className="w-full bg-[#6C3CE1]/10 text-[#6C3CE1] hover:bg-[#6C3CE1] hover:text-white dark:bg-[#6C3CE1]/20 dark:text-purple-300 dark:hover:bg-[#6C3CE1] dark:hover:text-white text-[12px] font-bold py-2 rounded-xl transition-all block text-center active:scale-95 cursor-pointer"
          >
            Beli Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}

// 📦 PANEL CARD: Bentuk Kotak Seragam dengan Source Code & App Premium
function PanelPricing() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
      
      {/* Card Utama Panel Pterodactyl Kotak */}
      <div className="bg-card border border-border/60 rounded-[24px] p-3 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full text-center relative group">
        
        <div className="relative aspect-square w-full bg-zinc-50 dark:bg-zinc-900/50 rounded-[18px] overflow-hidden flex items-center justify-center p-6 shrink-0 mb-3">
          <Server className="w-16 h-16 text-[#6C3CE1] dark:text-purple-400 group-hover:scale-[1.05] transition-transform duration-300" />
          <div className="absolute top-2.5 right-2.5">
            <span className="bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              PANEL
            </span>
          </div>
        </div>

        <div className="flex flex-col flex-1 px-1 justify-between">
          <div className="mb-3">
            <span className="text-[10px] text-[#6C3CE1] dark:text-purple-400 font-extrabold tracking-widest uppercase block mb-0.5">
              HOSTING
            </span>
            <h3 className="font-extrabold text-foreground text-[15px] leading-tight mb-1 group-hover:text-[#6C3CE1] dark:group-hover:text-purple-400 transition-colors line-clamp-1">
              Panel Pterodactyl
            </h3>
            <p className="text-[11px] font-medium text-muted-foreground line-clamp-1">
              High Performance Server
            </p>
          </div>

          <div className="pt-2.5 border-t border-border/50 mt-auto">
            <div className="text-foreground font-black text-[15px] mb-2">
              Mulai Rp2.000
            </div>
            <a
              href="https://t.me/username_tele_kamu" // <-- GANTI USERNAME TELEGRAM KAMU DI SINI
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white text-[12px] font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Order via Tele
            </a>
          </div>
        </div>
      </div>

      {/* Sisi Kanan: Daftar Keunggulan Panel */}
      <div className="sm:col-span-2 md:col-span-3 bg-card/40 border border-border/40 rounded-[24px] p-5 shadow-inner flex flex-col justify-center">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 text-center sm:text-left">
          Keunggulan Panel TanoPedia Style
        </h3>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5">
          {panelFeatures.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 bg-card p-3 rounded-xl border border-border/60 shadow-sm">
              <Check className="w-4 h-4 text-[#6C3CE1] dark:text-purple-400 shrink-0" />
              <span className="text-xs text-foreground/90 font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export function ProductsSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("semua");

  const getItemCount = () => {
    if (activeCategory === "semua") return scripts.length + 1 + apps.length;
    if (activeCategory === "panel") return 1;
    if (activeCategory === "script") return scripts.length;
    if (activeCategory === "app") return apps.length;
    return 0;
  };

  return (
    <section id="products" className="py-8 bg-background text-foreground px-3 sm:px-6 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        
        {/* Kategori Tabs */}
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

        <div className="mb-5">
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
            {activeCategory === "semua"
              ? "Semua Layanan"
              : activeCategory === "panel"
                ? "Panel Hosting"
                : activeCategory === "script"
                  ? "Source Code"
                  : "Aplikasi Premium"}{" "}
            <span className="text-[#6C3CE1]">({getItemCount()})</span>
          </h2>
        </div>

        {/* --- SECTION PANEL --- */}
        {(activeCategory === "semua" || activeCategory === "panel") && (
          <div id="panel" className="mb-10 scroll-mt-24">
            {activeCategory === "semua" && (
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-[#6C3CE1]" /> Panel Hosting
              </h3>
            )}
            <PanelPricing />
          </div>
        )}

        {/* --- SECTION SCRIPT --- */}
        {(activeCategory === "semua" || activeCategory === "script") && (
          <div id="script" className="mb-10 scroll-mt-24">
            {activeCategory === "semua" && (
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-[#6C3CE1]" /> Source Code
              </h3>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {scripts.map((script) => (
                <ProductCard key={script.id} item={script} type="script" />
              ))}
            </div>
          </div>
        )}

        {/* --- SECTION APP --- */}
        {(activeCategory === "semua" || activeCategory === "app") && (
          <div id="app" className="scroll-mt-24">
            {activeCategory === "semua" && (
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#6C3CE1]" /> Aplikasi Premium
              </h3>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {apps.map((app) => (
                <ProductCard key={app.id} item={app} type="app" />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
