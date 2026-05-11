"use client";

import React, { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, MessageCircle, Zap, Shield, Users } from "lucide-react";
import Link from "next/link";

const SLIDES = [
  {
    category: "PANEL PTERODACTYL",
    title: <>HOSTING <span className="text-teal-400">PREMIUM</span></>,
    desc: "Panel performa tinggi untuk bot & game server.",
    bg: "/images/zenon-sc.jpg",
    target: "#panel"
  },
  {
    category: "SCRIPT BOT WA",
    title: <>BOT <span className="text-teal-400">OTOMATIS</span></>,
    desc: "Script bot WhatsApp fitur terlengkap 24 jam.",
    bg: "/images/zenon-sc.jpg",
    target: "#script"
  },
  {
    category: "MOBILE APP",
    title: <>APP <span className="text-teal-400">PREMIUM</span></>,
    desc: "Aplikasi Android & iOS premium untukmu.",
    bg: "/images/qristano.png",
    target: "#app"
  }
];

export function HeroSection() {
  // 1. Inisialisasi Embla Dasar
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    duration: 30, // Biar gesernya smooth
  });

  // 2. Logic Auto Scroll Manual yang aman dari eror
  useEffect(() => {
    if (!emblaApi) return;

    const intervalId = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000); // Geser otomatis tiap 5 detik

    return () => clearInterval(intervalId);
  }, [emblaApi]);

  return (
    <section className="pt-20 pb-4 px-3 sm:px-6 bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        
        {/* --- 1. BANNER AREA --- */}
        <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl mb-3">
          
          {/* Viewport Embla (Tempat buat nge-swipe) */}
          <div className="overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex">
              {SLIDES.map((slide, index) => (
                <div className="flex-[0_0_100%] min-w-0 relative h-[230px] sm:h-[320px] flex items-center p-6 sm:p-12" key={index}>
                  
                  {/* Gambar (Terang & Jelas) */}
                  <img 
                    src={slide.bg} 
                    className="absolute inset-0 w-full h-full object-cover opacity-90 z-0" 
                    alt="banner" 
                  />
                  
                  {/* Overlay Gradien Tipis biar teks tetep kebaca */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent z-1" />

                  <div className="relative z-10 w-full">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 bg-teal-500/20 border border-teal-500/30 rounded-md px-2 py-0.5 mb-2.5">
                      <Zap className="w-3 h-3 text-teal-400 fill-teal-400 shadow-[0_0_8px_#14b8a6]" />
                      <span className="text-[9px] text-teal-400 font-bold uppercase tracking-widest italic">{slide.category}</span>
                    </div>
                    
                    <h1 className="text-3xl sm:text-5xl font-black text-white mb-2 italic tracking-tighter uppercase leading-tight drop-shadow-md">
                      {slide.title}
                    </h1>
                    
                    <p className="text-zinc-100 text-[11px] sm:text-base mb-6 max-w-[280px] sm:max-w-md line-clamp-1 italic font-medium drop-shadow-sm">
                      {slide.desc}
                    </p>
                    
                    <div className="flex gap-2">
                      <Link href={slide.target} className="bg-teal-500 hover:bg-teal-400 text-black px-5 py-2 rounded-lg font-black text-[11px] uppercase flex items-center gap-1.5 transition-all shadow-lg active:scale-95">
                        BELI <ChevronRight className="w-4 h-4" />
                      </Link>
                      <a href="https://wa.me/6285701961876" className="bg-zinc-800/90 border border-zinc-700 text-white px-5 py-2 rounded-lg font-bold text-[11px] flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4" /> CHAT
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- 2. STATS AREA (3 KOTAK TERPISAH) --- */}
        <div className="grid grid-cols-3 gap-2">
          {/* Kotak Pengguna */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl py-3 text-center flex flex-col items-center justify-center min-h-[75px]">
            <Users className="w-5 h-5 text-teal-500 mb-1" />
            <div className="text-base sm:text-2xl font-black text-white leading-none italic">5000+</div>
            <div className="text-[8px] sm:text-[10px] text-zinc-500 font-bold uppercase mt-1">Pengguna</div>
          </div>

          {/* Kotak Uptime */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl py-3 text-center flex flex-col items-center justify-center min-h-[75px]">
            <Zap className="w-5 h-5 text-teal-400 mb-1" />
            <div className="text-base sm:text-2xl font-black text-white leading-none italic">99.9%</div>
            <div className="text-[8px] sm:text-[10px] text-zinc-500 font-bold uppercase mt-1">Uptime</div>
          </div>

          {/* Kotak Support */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl py-3 text-center flex flex-col items-center justify-center min-h-[75px]">
            <Shield className="w-5 h-5 text-teal-300 mb-1" />
            <div className="text-base sm:text-2xl font-black text-white leading-none italic">24/7</div>
            <div className="text-[8px] sm:text-[10px] text-zinc-500 font-bold uppercase mt-1">Support</div>
          </div>
        </div>

      </div>
    </section>
  );
}
