"use client";

import { useState } from "react";
import { Check, Code, Server, Smartphone, MessageSquare, Star, X, Plus, Minus, CreditCard } from "lucide-react";
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
    description: "Sewa panel server High Performance kualitas terbaik untuk bot WhatsApp pro dan game server Anda. Garansi penuh dan uptime maksimal.",
    isNew: true,
    features: ["CPU & VPS stabil", "VPS legal", "Anti delay", "Uptime 24/7", "Anti suspend"],
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
    description: "PRO TEAM PLAN! Script JPM dengan fitur otomatisasi penyiaran pesan terlengkap, tanpa enkripsi, dan aman digunakan.",
    isNew: true,
    features: ["SWGC", "Automation", "Push kontak","All fitur work","No enc"],
  }
];

const apps: Script[] = [
  {
    id: 101,
    name: "ALIGHT MOTION PREMIUM",
    badge: "APP",
    badgeColor: "bg-[#6C3CE1]",
    price: 5000,
    rating: 4.9,
    reviews: 24,
    image: "/images/alightmotion.jpg",
    description: "Akun Alight Motion Pro berdurasi 1 tahun full premium tanpa watermark. Bisa pakai semua preset.",
    isNew: true,
    features: ["Aktif 1 Tahun", "No Watermark", "Bisa pakai semua Preset", "Bergaransi"],
  }
];

function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

export function ProductsSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("semua");
  const [selectedProduct, setSelectedProduct] = useState<Script | null>(null);
  
  // State Form Checkout sesuai gambar 1001760307.jpg
  const [quantity, setQuantity] = useState<number>(1);
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");

  const getItemCount = () => {
    if (activeCategory === "semua") return panelData.length + scripts.length + apps.length;
    if (activeCategory === "panel") return panelData.length;
    if (activeCategory === "script") return scripts.length;
    if (activeCategory === "app") return apps.length;
    return 0;
  };

  const openModal = (product: Script) => {
    setSelectedProduct(product);
    setQuantity(1); // reset qty tiap buka produk baru
    setWhatsappNumber(""); // reset nomor WA
  };

  const renderCard = (script: Script) => (
    <div 
      key={script.id}
      onClick={() => openModal(script)}
      className="bg-card border border-border rounded-[20px] overflow-hidden shadow-md hover:border-[#6C3CE1]/40 transition-all hover:-translate-y-1 p-[12px] duration-300 flex flex-col h-full cursor-pointer group"
    >
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

      <div className="pt-2.5 flex flex-col justify-between flex-1">
        <h3 className="font-bold text-foreground text-sm group-hover:text-[#6C3CE1] dark:group-hover:text-purple-400 transition-colors line-clamp-1 leading-snug">
          {script.name}
        </h3>
        <div className="text-[#6C3CE1] dark:text-purple-400 font-extrabold text-sm sm:text-base mt-1.5 border-t border-border/40 pt-1.5">
          {script.id === 201 ? "Mulai Rp 2.000" : formatPrice(script.price)}
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

        {/* GRID LAYOUTS */}
        {(activeCategory === "semua" || activeCategory === "panel") && (
          <div id="panel" className="mb-8 scroll-mt-24">
            {activeCategory === "semua" && <h3 className="text-base sm:text-lg font-bold text-foreground mb-4 flex items-center gap-2"><Server className="w-4 h-4 text-[#6C3CE1]" />Panel Hosting</h3>}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">{panelData.map(renderCard)}</div>
          </div>
        )}

        {(activeCategory === "semua" || activeCategory === "script") && (
          <div id="script" className="mb-8 scroll-mt-24">
            {activeCategory === "semua" && <h3 className="text-base sm:text-lg font-bold text-foreground mb-4 mt-8 flex items-center gap-2"><Code className="w-4 h-4 text-[#6C3CE1]" />Source Code</h3>}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">{scripts.map(renderCard)}</div>
          </div>
        )}

        {(activeCategory === "semua" || activeCategory === "app") && (
          <div id="app" className="scroll-mt-24">
            {activeCategory === "semua" && <h3 className="text-base sm:text-lg font-bold text-foreground mb-4 mt-8 flex items-center gap-2"><Smartphone className="w-4 h-4 text-[#6C3CE1]" />Aplikasi Premium</h3>}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">{apps.map(renderCard)}</div>
          </div>
        )}
      </div>

      {/* 📥 JENDELA DETAIL PESANAN YANG MIRIP 1001760307.jpg */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-card w-full sm:max-w-md rounded-t-[28px] sm:rounded-[24px] border border-border p-5 pb-24 sm:pb-6 max-h-[90vh] overflow-y-auto shadow-2xl relative transform transition-transform duration-300 animate-slideUp text-left">
            
            {/* Header Detail Pesanan */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">🛒 Detail Pesanan</h3>
              <button onClick={() => setSelectedProduct(null)} className="p-1 rounded-full bg-muted border border-border text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Kotak Info Item Dipilih */}
            <div className="bg-muted/30 border border-border/60 rounded-2xl p-3.5 mb-4">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1">ITEM DIPILIH</span>
              <h4 className="font-extrabold text-sm text-foreground leading-snug">{selectedProduct.name}</h4>
              <div className="border-l-2 border-[#6C3CE1] bg-[#6C3CE1]/5 p-2.5 my-2.5 rounded-r-xl text-[11px] text-muted-foreground leading-relaxed">
                {selectedProduct.description}
              </div>
              <div className="flex justify-between items-center text-xs pt-1.5 border-t border-border/40">
                <span className="font-bold text-muted-foreground uppercase tracking-wide text-[10px]">Harga Satuan</span>
                <span className="font-extrabold text-[#6C3CE1]">{formatPrice(selectedProduct.price)}</span>
              </div>
            </div>

            {/* JIKA BUKAN PANEL: Tampilkan Form Pengisian Lengkap seperti gambar 1001760307.jpg */}
            {!selectedProduct.isCustomTelegram ? (
              <>
                {/* Bagian Jumlah Beli */}
                <div className="mb-4">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Jumlah Beli</label>
                  <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden w-full">
                    <button 
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="p-2.5 px-4 bg-muted/40 hover:bg-muted text-foreground transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex-1 text-center font-extrabold text-sm text-foreground">{quantity}</div>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2.5 px-4 bg-muted/40 hover:bg-muted text-foreground transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bagian Metode Pembayaran */}
                <div className="mb-4">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Metode Pembayaran</label>
                  <div className="border-2 border-[#6C3CE1] bg-[#6C3CE1]/5 rounded-xl p-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded-lg border border-[#6C3CE1]/30">
                        <CreditCard className="w-4 h-4 text-[#6C3CE1]" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-foreground">QRIS (Otomatis)</p>
                        <p className="text-[10px] text-muted-foreground">Scan via DANA, GoPay, OVO, ShopeePay, dll.</p>
                      </div>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-[#6C3CE1] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Bagian Nomor WhatsApp */}
                <div className="mb-4">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Nomor WhatsApp Aktif</label>
                  <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden px-3 py-1">
                    <span className="text-xs font-bold text-muted-foreground border-r border-border pr-3 mr-3">+62 (ID)</span>
                    <input 
                      type="tel" 
                      placeholder="812xxxxxxxx" 
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/60 font-medium py-1.5"
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground/80 mt-1 block leading-tight">ℹ️ Invoice tagihan akan dikirim ke nomor ini.</span>
                </div>

                {/* Kotak Total Bayar */}
                <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 flex items-center justify-between mb-5">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide text-[11px]">Total Bayar</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-base sm:text-lg">
                    {formatPrice(selectedProduct.price * quantity)}
                  </span>
                </div>
              </>
            ) : (
              /* JIKA PRODUK PANEL: Berikan notice singkat saja tanpa form input */
              <div className="mb-5 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-xs text-muted-foreground leading-relaxed">
                Untuk layanan <strong>Panel Hosting</strong>, transaksi diproses secara manual melalui kontak admin demi keamanan alokasi spesifikasi server Anda.
              </div>
            )}

            {/* Tombol Aksi Bawah (Batal / Aksi Utama) */}
            <div className="flex items-center gap-3 pt-3 border-t border-border mt-4">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="flex-1 bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40 font-bold text-xs py-3 rounded-xl text-center uppercase tracking-wider transition-all cursor-pointer"
              >
                Batal
              </button>

              {selectedProduct.isCustomTelegram ? (
                <a
                  href="https://t.me/username_tele_kamu" // <-- GANTI USERNAME TELEGRAM KAMU DI SINI
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs py-3 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider shadow-md cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Beli via Tele
                </a>
              ) : (
                <Link
                  href={`/checkout?type=${selectedProduct.badge.toLowerCase()}&id=${selectedProduct.id}&qty=${quantity}&wa=${whatsappNumber}`}
                  className="flex-1 bg-gradient-to-r from-[#6C3CE1] to-[#a855f7] hover:opacity-95 text-white font-bold text-xs py-3 rounded-xl text-center flex items-center justify-center transition-all uppercase tracking-wider shadow-md shadow-[#6C3CE1]/15 cursor-pointer"
                >
                  Beli Sekarang →
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
