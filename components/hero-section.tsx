"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, MessageCircle, Zap, Shield, Users, Rocket } from "lucide-react";
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
        
        {/* --- CONTAINER UTAMA (BANNER HITAM) --- */}
        <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/40 shadow-2xl p-4 sm:p-6">
          
          {/* SLIDER AREA */}
          <div className="overflow-hidden mb-4" ref={emblaRef}>
            <div className="flex">
              {SLIDES.map((slide, index) => (
                <div className="flex-[0_0_100%] min-w-0 relative h-[240px] sm:h-[320px] flex items-center p-6" key={index}>
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
                      <Link href={slide.target} className="bg-teal-500 text-black px-5 py-2 rounded-xl font-black text-[11px] uppercase flex items-center gap-2">
                        BELI SEKARANG <ChevronRight className="w-4 h-4" />
                      </Link>
                      <a href="https://wa.me/6285701961876" className="bg-zinc-800/50 border border-zinc-700 text-white px-5 py-2 rounded-xl font-bold text-[11px] flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" /> CHAT
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- 4 KOTAK DI DALAM BANNER --- */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 relative z-20">
            {/* Kotak 1: Promo Kalimat Menarik */}
            <div className="bg-gradient-to-br from-teal-500/20 to-teal-500/5 border border-teal-500/30 rounded-2xl p-3 flex flex-col justify-center shadow-inner">
              <div className="flex items-center gap-1.5 mb-1">
                <Rocket className="w-3 h-3 text-teal-400" />
                <span className="text-[9px] font-black text-teal-400 uppercase italic">Special Offer</span>
              </div>
              <p className="text-[10px] sm:text-xs text-white font-black leading-tight uppercase italic">
                Sistem <span className="text-teal-400">Otomatis</span> - Bayar Langsung Aktif!
              </p>
            </div>

            {/* Kotak 2: Pengguna */}
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
              <Users className="w-4 h-4 text-teal-400 mb-1" />
              <div className="text-sm sm:text-lg font-black text-white italic">5000+</div>
              <div className="text-[8px] text-zinc-500 font-bold uppercase tracking-tighter">Pengguna</div>
            </div>

            {/* Kotak 3: Uptime */}
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
              <Zap className="w-4 h-4 text-teal-400 mb-1" />
              <div className="text-sm sm:text-lg font-black text-white italic">99.9%</div>
              <div className="text-[8px] text-zinc-500 font-bold uppercase tracking-tighter">Uptime</div>
            </div>

            {/* Kotak 4: Support */}
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
              <Shield className="w-4 h-4 text-teal-400 mb-1" />
              <div className="text-sm sm:text-lg font-black text-white italic">24/7</div>
              <div className="text-[8px] text-zinc-500 font-bold uppercase tracking-tighter">Support</div>
            </div>
          </div>

        </div>

        {/* Kotak Stats di luar banner (yang kamu kirim di gambar terakhir) biarin tetap ada di bawahnya */}
      </div>
    </section>
  );
}
