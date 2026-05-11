"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, MessageCircle, Zap, Shield, Users } from "lucide-react";
import Link from "next/link";

const SLIDES = [
  {
    category: "PANEL PTERODACTYL",
    title: <>HOSTING <span className="text-teal-400">PREMIUM</span></>,
    desc: "Panel performa tinggi untuk bot & game server.",
    bg: "/images/hero-1.jpg",
    target: "#panel"
  },
  {
    category: "SCRIPT BOT WA",
    title: <>BOT <span className="text-teal-400">OTOMATIS</span></>,
    desc: "Script bot WhatsApp fitur terlengkap 24 jam.",
    bg: "/images/zenon-sc.jpg",
    target: "#script"
  }
];

export function HeroSection() {
  const [emblaRef] = useEmblaCarousel({ loop: true });

  return (
    <section className="pt-16 pb-4 px-3 sm:px-6 bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        
        {/* --- 1. SLIDER AREA (TINGGI DIKECILIN) --- */}
        <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/40 shadow-xl mb-3" ref={emblaRef}>
          <div className="flex">
            {SLIDES.map((slide, index) => (
              <div className="flex-[0_0_100%] min-w-0 relative h-[220px] sm:h-[300px] flex items-center p-5 sm:p-10" key={index}>
                <img src={slide.bg} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="" />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent z-1" />

                <div className="relative z-10 w-full">
                  <div className="inline-flex items-center gap-1.5 bg-zinc-800/80 border border-zinc-700 px-2 py-0.5 rounded-md mb-2">
                    <div className="w-1 h-1 bg-teal-500 rounded-full animate-pulse" />
                    <span className="text-[8px] text-zinc-400 font-black uppercase tracking-widest italic">{slide.category}</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black text-white mb-1.5 italic tracking-tighter uppercase leading-none">
                    {slide.title}
                  </h1>
                  <p className="text-zinc-400 text-[10px] sm:text-sm mb-5 max-w-[250px] sm:max-w-sm line-clamp-1 italic">
                    {slide.desc}
                  </p>
                  <div className="flex gap-2">
                    <Link href={slide.target} className="bg-teal-500 hover:bg-teal-400 text-black px-4 py-2 rounded-lg font-black text-[10px] uppercase flex items-center gap-1.5 transition-all">
                      BELI <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    <a href="https://wa.me/6285701961876" className="bg-zinc-800/50 border border-zinc-700 text-white px-4 py-2 rounded-lg font-bold text-[10px] flex items-center gap-1.5 transition-all">
                      <MessageCircle className="w-3.5 h-3.5" /> CHAT
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- 2. STATS AREA (3 KOTAK LEBIH RAPET) --- */}
        <div className="grid grid-cols-3 gap-2">
          {/* Kotak Pengguna */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl py-2.5 text-center flex flex-col items-center justify-center min-h-[70px]">
            <Users className="w-4 h-4 text-teal-400 mb-0.5" />
            <div className="text-sm sm:text-xl font-black text-white leading-none italic">5000+</div>
            <div className="text-[8px] text-zinc-500 font-bold uppercase tracking-tighter">Pengguna</div>
          </div>

          {/* Kotak Uptime */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl py-2.5 text-center flex flex-col items-center justify-center min-h-[70px]">
            <Zap className="w-4 h-4 text-teal-400 mb-0.5" />
            <div className="text-sm sm:text-xl font-black text-white leading-none italic">99.9%</div>
            <div className="text-[8px] text-zinc-500 font-bold uppercase tracking-tighter">Uptime</div>
          </div>

          {/* Kotak Support */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl py-2.5 text-center flex flex-col items-center justify-center min-h-[70px]">
            <Shield className="w-4 h-4 text-teal-400 mb-0.5" />
            <div className="text-sm sm:text-xl font-black text-white leading-none italic">24/7</div>
            <div className="text-[8px] text-zinc-500 font-bold uppercase tracking-tighter">Support</div>
          </div>
        </div>

      </div>
    </section>
  );
}
