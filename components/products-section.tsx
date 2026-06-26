"use client";

import { useState } from "react";
import { Star, Check, Crown, Zap, Code, Server, Smartphone } from "lucide-react";
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
}

const categories = [
  { id: "semua", label: "Semua" },
  { id: "panel", label: "Panel" },
  { id: "script", label: "Script" },
  { id: "app", label: "App" },
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
    description: "Script JPM fitur lumayan banyak",
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
    description: "Akun alight motion pro 1 tahun.",
    isNew: true,
    features: ["Aktif 1 Tahun", "No Watermark", "Bisa pakai semua Preset", "Bergaransi"],
  }
];

const pricingPlans = [
  { ram: "1GB", price: 2000, label: null },
  { ram: "2GB", price: 3000, label: null },
  { ram: "3GB", price: 4000, label: "Starter", icon: Zap },
  { ram: "4GB", price: 5000, label: null },
  { ram: "5GB", price: 6500, label: "Popular", icon: Star, highlight: true },
  { ram: "6GB", price: 7500, label: null },
  { ram: "7GB", price: 8500, label: "Best Value", icon: Crown },
  { ram: "8GB", price: 9500, label: null },
  { ram: "9GB", price: 10500, label: null },
  { ram: "10GB", price: 12000, label: null },
  { ram: "Unlimited", price: 15000, label: "Ultimate", icon: Crown, isUnlimited: true },
];

const panelFeatures = [
  "CPU stabil",
  "VPS legal & stabil",
  "Server fast & anti delay",
  "Uptime 24/7",
  "Anti suspend",
  "Garansi aktif 20hari",
  "Technical Support 24/7",
];

function formatPrice(price: number): string {
  return `Rp${price.toLocaleString("id-ID")}`;
}

function ScriptCard({ script }: { script: Script }) {
  return (
    <div className="bg-[#1a1a2e] border border-white/5 rounded-[20px] overflow-hidden shadow-xl hover:border-[#6C3CE1]/40 transition-all hover:-translate-y-1 group flex flex-col h-full p-[12px]">
      <div className="relative h-[110px] w-full bg-zinc-800 rounded-[14px] overflow-hidden shrink-0">
        <img 
          src={script.image || "/placeholder-script.jpg"} 
          alt={script.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 flex gap-1">
          {script.isNew && (
            <span className="bg-gradient-to-r from-[#f43f5e] to-[#e11d48] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              HOT
            </span>
          )}
        </div>
        <div className="absolute top-2 right-2">
          <span className={`${script.badgeColor} text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-[0.5px]`}>
            {script.badge}
          </span>
        </div>
      </div>

      <div className="pt-3 flex flex-col flex-1">
        <h3 className="font-bold text-white text-sm mb-0.5 group-hover:text-[#6C3CE1] transition-colors line-clamp-1 leading-[1.2]">
          {script.name}
        </h3>
        <p className="text-[11px] font-medium text-zinc-400 mb-3 line-clamp-2">{script.description}</p>
        
        {/* Fitur */}
        <div className="flex-1 space-y-1 mb-4">
          {script.features?.map((feat, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Check className="w-3 h-3 text-[#6C3CE1] shrink-0" />
              <span className="text-[10px] text-zinc-300 font-medium line-clamp-1">{feat}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1 mb-3 mt-auto">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-[10px] text-zinc-400">
            {script.rating}
          </span>
        </div>
        
        <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-white/5">
          <div className="text-[#6C3CE1] font-bold text-sm sm:text-base">{formatPrice(script.price)}</div>
          <Link
            href={`/checkout?type=${script.badge.toLowerCase()}&id=${script.id}&name=${encodeURIComponent(script.name)}&price=${script.price}`}
            className="bg-gradient-to-r from-[#6C3CE1] to-[#a855f7] text-white text-[11px] font-bold px-4 py-1.5 rounded-full shadow-md shadow-[#6C3CE1]/15 active:scale-95 transition-all"
          >
            Beli
          </Link>
        </div>
      </div>
    </div>
  );
}

function PanelPricing() {
  return (
    <div>
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 mb-4">
        {pricingPlans.map((plan, index) => {
          const Icon = plan.icon;
          const planId = `panel-${plan.ram.toLowerCase()}`;
          const checkoutUrl = `/checkout?type=panel&id=${planId}&name=${encodeURIComponent(`RAM ${plan.ram}`)}&price=${plan.price}`;

          return (
            <Link
              key={index}
              href={checkoutUrl}
              className={`relative bg-[#1a1a2e] border rounded-[20px] p-3.5 text-center transition-all hover:-translate-y-1 hover:shadow-lg block ${
                plan.highlight
                  ? "border-[#6C3CE1] ring-2 ring-[#6C3CE1]/20 shadow-[0_8px_25px_rgba(108,60,225,0.15)]"
                  : plan.isUnlimited
                    ? "border-amber-400 ring-2 ring-amber-400/20 col-span-2 xs:col-span-1"
                    : "border-white/5 hover:border-[#6C3CE1]/50 shadow-md"
              }`}
            >
              {plan.label && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <span
                    className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 text-[9px] font-bold rounded-full whitespace-nowrap uppercase tracking-wide ${
                      plan.isUnlimited
                        ? "bg-amber-400 text-black"
                        : plan.highlight
                          ? "bg-gradient-to-r from-[#6C3CE1] to-[#a855f7] text-white"
                          : "bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    {Icon && <Icon className="w-2.5 h-2.5" />}
                    {plan.label}
                  </span>
                </div>
              )}
              <Server className={`w-5 h-5 mx-auto mb-1.5 ${
                plan.isUnlimited ? "text-amber-400" : plan.highlight ? "text-[#6C3CE1]" : "text-zinc-500"
              }`} />
              <div className={`text-xl font-extrabold italic leading-none mb-1 ${
                plan.isUnlimited ? "text-amber-400" : plan.highlight ? "text-[#6C3CE1]" : "text-white"
              }`}>
                {plan.ram}
              </div>
              <div className="text-xs text-teal-400 font-bold mb-3">
                {formatPrice(plan.price)}
              </div>
              <span className={`block text-[11px] font-bold py-1.5 rounded-full transition-all active:scale-95 ${
                plan.isUnlimited
                  ? "bg-amber-400 text-black"
                  : plan.highlight
                    ? "bg-gradient-to-r from-[#6C3CE1] to-[#a855f7] text-white shadow-md shadow-[#6C3CE1]/20"
                    : "bg-[#6c3ce1]/20 text-[#6C3CE1] hover:bg-[#6C3CE1] hover:text-white"
              }`}>
                Beli
              </span>
            </Link>
          );
        })}
      </div>

      <div className="bg-[#1a1a2e]/50 border border-white/5 rounded-[20px] p-4 sm:p-5 shadow-xl">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 text-center">
          Keunggulan Panel TanoPedia Style
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {panelFeatures.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 bg-[#1a1a2e] p-2.5 rounded-xl border border-white/5">
              <Check className="w-3.5 h-3.5 text-[#6C3CE1]" />
              <span className="text-xs text-zinc-300 font-medium">{feature}</span>
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
    if (activeCategory === "semua") return scripts.length + pricingPlans.length + apps.length;
    if (activeCategory === "panel") return pricingPlans.length;
    if (activeCategory === "script") return scripts.length;
    if (activeCategory === "app") return apps.length;
    return 0;
  };

  return (
    <section id="products" className="py-8 bg-[#0c0c1e] px-3 sm:px-6">
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
                  : "bg-[#1a1a2e] border border-white/5 text-zinc-300 hover:border-[#6C3CE1] hover:text-[#6C3CE1]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <h2 className="text-xs text-zinc-400 uppercase tracking-wider font-bold">
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

        {/* --- ID PANEL --- */}
        {(activeCategory === "semua" || activeCategory === "panel") && (
          <div id="panel" className="mb-8 scroll-mt-24">
            {activeCategory === "semua" && (
              <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Server className="w-4 h-4 text-[#6C3CE1]" />
                Panel Hosting
              </h3>
            )}
            <PanelPricing />
          </div>
        )}

        {/* --- ID SCRIPT --- */}
        {(activeCategory === "semua" || activeCategory === "script") && (
          <div id="script" className="mb-8 scroll-mt-24">
            {activeCategory === "semua" && (
              <h3 className="text-base sm:text-lg font-bold text-white mb-4 mt-8 flex items-center gap-2">
                <Code className="w-4 h-4 text-[#6C3CE1]" />
                Source Code
              </h3>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
              {scripts.map((script) => (
                <ScriptCard key={script.id} script={script} />
              ))}
            </div>
          </div>
        )}

        {/* --- ID APP --- */}
        {(activeCategory === "semua" || activeCategory === "app") && (
          <div id="app" className="scroll-mt-24">
            {activeCategory === "semua" && (
              <h3 className="text-base sm:text-lg font-bold text-white mb-4 mt-8 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#6C3CE1]" />
                Aplikasi Premium
              </h3>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
              {apps.map((app) => (
                <ScriptCard key={app.id} script={app} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
