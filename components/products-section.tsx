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
    badgeColor: "bg-violet-500",
    price: 15000,
    rating: 5.0,
    reviews: 64,
    image: "/images/zenon-sc.jpg", 
    description: "Script JPM fitur lumayan banyak",
    isNew: true, 
  }
];

const apps: Script[] = [
  {
    id: 101,
    name: "ALIGHT MOTION",
    badge: "APP",
    badgeColor: "bg-blue-500",
    price: 5000,
    rating: 4.9,
    reviews: 24,
    image: "/images/alightmotion.jpg",
    description: "Akun alight motion pro 1 tahun.",
    isNew: true,
  }
];

const pricingPlans = [
  { ram: "1GB", price: 1000, label: null },
  { ram: "2GB", price: 2000, label: null },
  { ram: "3GB", price: 3000, label: "Starter", icon: Zap },
  { ram: "4GB", price: 4000, label: null },
  { ram: "5GB", price: 5000, label: "Popular", icon: Star, highlight: true },
  { ram: "6GB", price: 6000, label: null },
  { ram: "7GB", price: 7000, label: "Best Value", icon: Crown },
  { ram: "8GB", price: 8000, label: null },
  { ram: "9GB", price: 9000, label: null },
  { ram: "10GB", price: 10000, label: null },
  { ram: "Unlimited", price: 12000, label: "Ultimate", icon: Crown, isUnlimited: true },
];

const panelFeatures = [
  "Cpu stabil",
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
    <div className="bg-zinc-900/90 border border-zinc-700/80 rounded-xl overflow-hidden hover:border-teal-400/60 transition-all hover:-translate-y-1 group">
      <div className="relative aspect-[4/3] bg-zinc-800 overflow-hidden">
        <img 
          src={script.image || "/placeholder-script.jpg"} 
          alt={script.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-100 group-hover:opacity-100"
        />

        <div className="absolute top-2 left-2 flex gap-1">
          {script.isNew && (
            <span className="bg-rose-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded shadow-sm">
              BARU
            </span>
          )}
        </div>
        <div className="absolute top-2 right-2">
          <span className={`${script.badgeColor} text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded shadow-sm`}>
            {script.badge}
          </span>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-white text-xs sm:text-sm mb-1 group-hover:text-teal-400 transition-colors line-clamp-1">
          {script.name}
        </h3>
        <p className="text-[10px] sm:text-xs text-zinc-400 mb-2 sm:mb-3 line-clamp-2">{script.description}</p>
        <div className="flex items-center gap-1 mb-2 sm:mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-[10px] sm:text-xs text-zinc-400">
            {script.rating} ({script.reviews})
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="text-teal-400 font-bold text-sm sm:text-base">{formatPrice(script.price)}</div>
          <Link
            href={`/checkout?type=${script.badge.toLowerCase()}&id=${script.id}&name=${encodeURIComponent(script.name)}&price=${script.price}`}
            className="bg-teal-500 hover:bg-teal-400 text-black text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors shadow-lg shadow-teal-500/20"
          >
            Order
          </Link>
        </div>
      </div>
    </div>
  );
}

function PanelPricing() {
  return (
    <div>
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 mb-4 sm:mb-6">
        {pricingPlans.map((plan, index) => {
          const Icon = plan.icon;
          const planId = `panel-${plan.ram.toLowerCase()}`;
          const checkoutUrl = `/checkout?type=panel&id=${planId}&name=${encodeURIComponent(`RAM ${plan.ram}`)}&price=${plan.price}`;

          return (
            <Link
              key={index}
              href={checkoutUrl}
              className={`relative bg-zinc-900/90 border rounded-xl p-3 sm:p-4 text-center transition-all hover:-translate-y-1 hover:shadow-lg block ${
                plan.highlight
                  ? "border-teal-400 ring-2 ring-teal-400/30 hover:shadow-teal-500/20"
                  : plan.isUnlimited
                    ? "border-amber-400 ring-2 ring-amber-400/30 col-span-2 xs:col-span-1 hover:shadow-amber-500/20"
                    : "border-zinc-700/80 hover:border-teal-400/50"
              }`}
            >
              {plan.label && (
                <div className="absolute -top-2.5 sm:-top-3 left-1/2 -translate-x-1/2">
                  <span
                    className={`inline-flex items-center gap-0.5 sm:gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[8px] sm:text-[10px] font-bold rounded-full whitespace-nowrap ${
                      plan.isUnlimited
                        ? "bg-amber-400 text-black"
                        : plan.highlight
                          ? "bg-teal-400 text-black"
                          : "bg-zinc-700 text-zinc-300"
                    }`}
                  >
                    {Icon && <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                    {plan.label}
                  </span>
                </div>
              )}
              <Server className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1.5 sm:mb-2 ${
                plan.isUnlimited ? "text-amber-400" : plan.highlight ? "text-teal-400" : "text-zinc-500"
              }`} />
              <div className={`text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 sm:mb-1 ${
                plan.isUnlimited ? "text-amber-400" : plan.highlight ? "text-teal-400" : "text-white"
              }`}>
                {plan.ram}
              </div>
              <div className="text-sm sm:text-base text-teal-400 font-bold mb-2 sm:mb-3">
                {formatPrice(plan.price)}
              </div>
              <span className={`block text-[10px] sm:text-xs font-bold py-1.5 sm:py-2 rounded-lg transition-colors ${
                plan.isUnlimited
                  ? "bg-amber-400 hover:bg-amber-300 text-black"
                  : plan.highlight
                    ? "bg-teal-500 hover:bg-teal-400 text-black"
                    : "bg-teal-500/20 hover:bg-teal-500 text-teal-400 hover:text-black"
              }`}>
                Order
              </span>
            </Link>
          );
        })}
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-6">
        <h3 className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 text-center">
          Keunggulan Panel ZenonStore
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {panelFeatures.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800/50">
              <Check className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-[11px] sm:text-xs text-zinc-300">{feature}</span>
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
    <section id="products" className="py-8 sm:py-10 lg:py-12 px-3 sm:px-4 lg:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as Category)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? "bg-teal-500 text-black shadow-lg shadow-teal-500/30"
                  : "bg-zinc-800/80 border border-zinc-600 text-zinc-300 hover:border-teal-400 hover:text-teal-400"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="mb-4 sm:mb-6">
          <h2 className="text-xs sm:text-sm text-zinc-400 uppercase tracking-wider font-medium">
            {activeCategory === "semua"
              ? "Semua Produk"
              : activeCategory === "panel"
                ? "Panel"
                : activeCategory === "script"
                  ? "Source Code"
                  : "Aplikasi"}{" "}
            <span className="text-teal-400">({getItemCount()})</span>
          </h2>
        </div>

        {/* --- ID PANEL --- */}
        {(activeCategory === "semua" || activeCategory === "panel") && (
          <div id="panel" className="mb-8 sm:mb-10 scroll-mt-24">
            {activeCategory === "semua" && (
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-5 flex items-center gap-2">
                <Server className="w-5 h-5 text-teal-400" />
                Panel
              </h3>
            )}
            <PanelPricing />
          </div>
        )}

        {/* --- ID SCRIPT --- */}
        {(activeCategory === "semua" || activeCategory === "script") && (
          <div id="script" className="mb-8 sm:mb-10 scroll-mt-24">
            {activeCategory === "semua" && (
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-5 mt-8 sm:mt-10 flex items-center gap-2">
                <Code className="w-5 h-5 text-teal-400" />
                Source Code
              </h3>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 text-zinc-100">
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
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-5 mt-8 sm:mt-10 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-teal-400" />
                Aplikasi
              </h3>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 text-zinc-100">
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
