"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, MessageCircle, Server, Code, Smartphone, Zap } from "lucide-react";
import Link from "next/link";

const SLIDES = [
  {
    category: "PANEL PTERODACTYL",
    title: <>HOSTING <span className="text-teal-400">PREMIUM</span></>,
    desc: "Panel performa tinggi untuk bot & game server tanpa delay.",
    bg: "/images/hero-1.jpg",
    target: "#panel"
  },
  {
    category: "SCRIPT BOT WA",
    title: <>BOT <span className="text-teal-400">OTOMATIS</span></>,
    desc: "Script bot WhatsApp fitur terlengkap & anti delay 24 jam.",
    bg: "/images/hero-2.jpg",
    target: "#script"
  }
];

export function HeroSection() {
  const [emblaRef] = useEmblaCarousel({ loop: true });

  return (
    <section className="pt-16 pb-6 px-3 sm:px-6 bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        
        {/* --- BANNER AREA (YANG DIUBAH) --- */}
        <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/40 shadow-2xl p-4 sm:p-6 mb-6">
          
          {/* SLIDER UTAMA */}
          <div className="overflow-hidden mb-6" ref={emblaRef}>
            <div className="flex">
              {SLIDES.map((slide, index) => (
                <div className="flex-[0_0_100%] min-w-0 relative h-[240px] sm:h-[320px] flex items-center p-4 sm:p-8" key={index}>
                  <img src={slide.bg} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent z-1" />

                  <div className="relative z-10 w-full">
                    <div className="inline-flex items-center gap-2 bg-zinc-800/80 border border-zinc-700 px-3 py-1 rounded-lg mb-3">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
                      <span className="text-[9px] text-zinc-300 font-black uppercase tracking-widest italic">{slide.category}</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-white mb-2 italic tracking-tighter uppercase leading-none">
                      {slide.title}
                    </h1>
                    <p className="text-zinc-400 text-[11px] sm:text-sm mb-6 max-w-sm line-clamp-2">{slide.desc}</p>
                    <div className="flex gap-3">
                      <Link href={slide.target} className="bg-teal-500 hover:bg-teal-400 text-black px-6 py-2.5 rounded-xl font-black text-[11px] uppercase flex items-center gap-2 transition-all">
                        BELI SEKARANG <ChevronRight className="w-4 h-4" />
                      </Link>
                      <a href="https://wa.me/6285701961876" className="bg-zinc-800/50 border border-zinc-700 text-white px-6 py-2.5 rounded-xl font-bold text-[11px] flex items-center gap-2 transition-all">
                        <MessageCircle className="w-4 h-4" /> CHAT
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- 4 KOTAK PRODUK DI DALAM BANNER (YANG LU MAU) --- */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 relative z-20">
            {/* Kotak Promo */}
            <div className="bg-gradient-to-br from-teal-500/20 to-zinc-900 border border-teal-500/30 rounded-2xl p-3 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 mb-1">
                <Zap className="w-3 h-3 text-teal-400" />
                <span className="text-[9px] font-black text-teal-400 uppercase italic">Special Offer</span>
              </div>
              <p className="text-[10px] sm:text-xs text-white font-black leading-tight uppercase italic">
                SISTEM <span className="text-teal-400">OTOMATIS</span> - BAYAR LANGSUNG AKTIF!
              </p>
            </div>

            {/* Kotak Cloud Panel */}
            <Link href="#panel" className="bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-3 flex flex-col items-center justify-center text-center group hover:border-teal-500/50 transition-all">
              <Server className="w-5 h-5 text-teal-400 mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-[11px] font-black text-white uppercase italic leading-none">Cloud Panel</div>
              <div className="text-[8px] text-zinc-500 font-bold uppercase mt-1">Mulai Rp1.000</div>
            </Link>

            {/* Kotak Script Bot */}
            <Link href="#script" className="bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-3 flex flex-col items-center justify-center text-center group hover:border-teal-500/50 transition-all">
              <Code className="w-5 h-5 text-teal-400 mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-[11px] font-black text-white uppercase italic leading-none">Script Bot</div>
              <div className="text-[8px] text-zinc-500 font-bold uppercase mt-1">Best Features</div>
            </Link>

            {/* Kotak Premium App */}
            <Link href="#app" className="bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-3 flex flex-col items-center justify-center text-center group hover:border-teal-500/50 transition-all">
              <Smartphone className="w-5 h-5 text-teal-400 mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-[11px] font-black text-white uppercase italic leading-none">Premium App</div>
              <div className="text-[8px] text-zinc-500 font-bold uppercase mt-1">Trusted App</div>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
