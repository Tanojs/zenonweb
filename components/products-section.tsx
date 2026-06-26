"use client";

import { useState } from "react";
import { Check, Code, Server, Smartphone, MessageSquare, Star, X } from "lucide-react";
import Link from "next/link";

type Category = "semua" | "panel" | "script" | "app";

interface Script {
  id: number;
  name: string;
  badge: string;
  badgeColor: string;
  price: number;
  rating: number;
  reviews: number;
  description: string;
  image?: string; 
  isNew?: boolean;
  features: string[];
  isCustomTelegram?: boolean;
}

const categories = [
  { id: "semua", label: "Semua" },
  { id: "panel", label: "Panel" },
  { id: "script", label: "Script" },
  { id: "app", label: "App" },
];

const panelData: Script[] = [
  {
    id: 201,
    name: "Panel Pterodactyl",
    badge: "PANEL",
    badgeColor: "bg-[#6C3CE1]",
    price: 2000,
    rating: 5.0,
    reviews: 42,
    image: "", 
    description: "Sewa panel server High Performance kualitas terbaik untuk bot WhatsApp pro dan game server Anda.",
    isNew: true,
    features: ["CPU & VPS stabil", "VPS legal", "Anti delay", "Uptime 24/7", "Anti suspend", "Garansi aktif 20 hari"],
    isCustomTelegram: true
  }
];

const scripts: Script[] = [
  {
    id: 1,
    name: "Script Zenon JPM",
    badge: "SCRIPT",
    badgeColor: "bg-purple-600",
    price: 15000,
    rating: 5.0,
    reviews: 64,
    image: "/images/zenon-sc.jpg", 
    description: "Script JPM dengan fitur otomatisasi penyiaran pesan (JPM) terlengkap, tanpa enkripsi, dan siap pakai.",
    isNew: true,
    features: ["SWGC", "Automation", "Push kontak","All fitur work","No enc"],
  }
];

const apps: Script[] = [
  {
    id: 101,
    name: "ALIGHT MOTION",
    badge: "APP",
    badgeColor: "bg-[#6C3CE1]",
    price: 5000,
    rating: 4.9,
    reviews: 24,
    image: "/images/alightmotion.jpg",
    description: "Akun Alight Motion Pro berdurasi 1 tahun full premium tanpa watermark.",
    isNew: true,
    features: ["Aktif 1 Tahun", "No Watermark", "Bisa pakai semua Preset", "Bergaransi"],
  }
];

function formatPrice(price: number): string {
  if (price === 2000) return "Mulai Rp2.000";
  return `Rp${price.toLocaleString("id-ID")}`;
}

export function ProductsSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("semua");
  const [selectedProduct, setSelectedProduct] = useState<Script | null>(null);

  const getItemCount = () => {
    if (activeCategory === "semua") return panelData.length + scripts.length + apps.length;
    if (activeCategory === "panel") return panelData.length;
    if (activeCategory === "script") return scripts.length;
    if (activeCategory === "app") return apps.length;
    return 0;
  };

  // Komponen Card Kecil & Rapi (Hanya Logo, Nama, Harga)
  const renderCard = (script: Script) => (
    <div 
      key={script.id}
      onClick={() => setSelectedProduct(script)}
      className="bg-card border border-border rounded-[20px] overflow-hidden shadow-md hover:border-[#6C3CE1]/40 transition-all hover:-translate-y-1 p-[12px] duration-300 flex flex-col h-full cursor-pointer group"
    >
      {/* Bagian Logo */}
      <div className="relative h-[110px] w-full bg-zinc-200 dark:bg-zinc-800 rounded-[14px] overflow-hidden shrink-0 flex items-center justify-center">
        {script.image ? (
          <img src={script.image} alt={script.name} className="w-full h-full object-cover" />
        ) : (
          <Server className="w-10 h-10 text-[#6C3CE1]" />
        )}
        <div className="absolute top-2 left-2">
          {script.isNew && (
            <span className="bg-gradient-to-r from-[#f43f5e] to-[#e11d48] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">HOT</span>
          )}
        </div>
        <div className="absolute top-2 right-2">
          <span className={`${script.badgeColor} text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-sm uppercase`}>{script.badge}</span>
        </div>
      </div>

      {/* Hanya Nama dan Harga Langsung Di Bawah Logo */}
      <div className="pt-2.5 flex flex-col justify-between flex-1">
        <h3 className="font-bold text-foreground text-sm group-hover:text-[#6C3CE1] dark:group-hover:text-purple-400 transition-colors line-clamp-1 leading-snug">
          {script.name}
        </h3>
        <div className="text-[#6C3CE1] dark:text-purple-400 font-extrabold text-sm sm:text-base mt-1.5 border-t border-border/40 pt-1.5">
          {formatPrice(script.price)}
        </div>
      </div>
    </div>
  );

  return (
    <section id="products" className="py-8 bg-background text-foreground px-3 sm:px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Kategori Tabs */}
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

        <div className="mb-4">
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
            {activeCategory === "semua" ? "Semua Layanan" : activeCategory === "panel" ? "Panel Hosting" : activeCategory === "script" ? "Source Code" : "Aplikasi Premium"}{" "}
            <span className="text-[#6C3CE1]">({getItemCount()})</span>
          </h2>
        </div>

        {/* --- GRID PANEL --- */}
        {(activeCategory === "semua" || activeCategory === "panel") && (
          <div id="panel" className="mb-8 scroll-mt-24">
            {activeCategory === "semua" && (
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-4 flex items-center gap-2"><Server className="w-4 h-4 text-[#6C3CE1]" />Panel Hosting</h3>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
              {panelData.map(renderCard)}
            </div>
          </div>
        )}

        {/* --- GRID SCRIPT --- */}
        {(activeCategory === "semua" || activeCategory === "script") && (
          <div id="script" className="mb-8 scroll-mt-24">
            {activeCategory === "semua" && (
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-4 mt-8 flex items-center gap-2"><Code className="w-4 h-4 text-[#6C3CE1]" />Source Code</h3>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
              {scripts.map(renderCard)}
            </div>
          </div>
        )}

        {/* --- GRID APP --- */}
        {(activeCategory === "semua" || activeCategory === "app") && (
          <div id="app" className="scroll-mt-24">
            {activeCategory === "semua" && (
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-4 mt-8 flex items-center gap-2"><Smartphone className="w-4 h-4 text-[#6C3CE1]" />Aplikasi Premium</h3>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
              {apps.map(renderCard)}
            </div>
          </div>
        )}
      </div>

      {/* 📥 JENDELA DETAIL MODAL POP-UP */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn">
          {/* pb-24 ditambahkan agar konten terbawah modal naik dan tidak terhalang Navigasi Menu Utama HP */}
          <div className="bg-card w-full sm:max-w-md rounded-t-[28px] sm:rounded-[24px] border border-border p-5 pb-24 sm:pb-6 max-h-[85vh] overflow-y-auto shadow-2xl relative transform transition-transform duration-300 animate-slideUp">
            
            {/* Tombol Close Silang */}
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Nama & Badge Produk */}
            <div className="flex items-center gap-2 mt-2 mb-3">
              <span className={`${selectedProduct.badgeColor} text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase`}>
                {selectedProduct.badge}
              </span>
              <h3 className="text-lg font-black text-foreground">{selectedProduct.name}</h3>
            </div>

            <hr className="border-border my-3" />

            {/* Deskripsi Lengkap */}
            <div className="mb-4">
              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Deskripsi</h4>
              <p className="text-xs text-foreground/90 leading-relaxed font-medium">{selectedProduct.description}</p>
            </div>

            {/* Fitur Layanan */}
            <div className="mb-5">
              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Fitur Utama</h4>
              <div className="space-y-1.5 bg-muted/40 border border-border/50 p-3 rounded-xl">
                {selectedProduct.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#6C3CE1] shrink-0" />
                    <span className="text-xs text-foreground/80 font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bagian Bawah: Harga & Tombol Aksi Akhir */}
            <div className="flex items-center justify-between gap-4 pt-3 border-t border-border mt-6">
              <div>
                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Total Harga</p>
                <p className="text-[#6C3CE1] dark:text-purple-400 text-base sm:text-lg font-black italic">{formatPrice(selectedProduct.price)}</p>
              </div>

              {selectedProduct.isCustomTelegram ? (
                <a
                  href="https://t.me/username_tele_kamu" // <-- GANTI USERNAME TELEGRAM KAMU DI SINI
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer uppercase tracking-wide"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Order via Tele
                </a>
              ) : (
                <Link
                  href={`/checkout?type=${selectedProduct.badge.toLowerCase()}&id=${selectedProduct.id}&name=${encodeURIComponent(selectedProduct.name)}&price=${selectedProduct.price}`}
                  className="bg-gradient-to-r from-[#6C3CE1] to-[#a855f7] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md shadow-[#6C3CE1]/15 active:scale-95 transition-all text-center cursor-pointer uppercase tracking-wide"
                >
                  Beli Sekarang
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
