"use client";

import React, { useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, MessageCircle, Zap, Shield, Users } from "lucide-react";
import Link from "next/link";

const SLIDES = [
  {
    category: "PANEL PTERODACTYL",
    title: <>HOSTING <span className="text-teal-400 drop-shadow-[0_2px_10px_rgba(20,184,166,0.3)]">PREMIUM</span></>,
    desc: "Panel performa tinggi untuk bot & game server.",
    bg: "/images/zenon-sc.jpg",
    target: "#panel"
  },
  {
    category: "SCRIPT BOT WA",
    title: <>BOT <span className="text-teal-400 drop-shadow-[0_2px_10px_rgba(20,184,166,0.3)]">OTOMATIS</span></>,
    desc: "Script bot WhatsApp fitur terlengkap 24 jam.",
    bg: "/images/qristano.png",
    target: "#script"
  },
  {
    category: "MOBILE APP",
    title: <>APP <span className="text-teal-400 drop-shadow-[0_2px_10px_rgba(20,184,166,0.3)]">PREMIUM</span></>,
    desc: "Aplikasi Android & iOS premium untukmu.",
    bg: "/images/hero-3.jpg",
    target: "#app"
  }
];

export function HeroSection() {
  // Pakai embla dasar tanpa plugin tambahan biar gak eror build
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  // Fungsi buat geser otomatis pakai logic manual
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    const intervalId = setInterval(scrollNext, 5000); // Geser tiap 5 detik (sedikit lebih lambat)
    return () => clearInterval(intervalId);
  }, [scrollNext]);

  return (
    <section className="pt-20 sm:pt-24 pb-4 px-3 sm:px-6 bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        
        {/* --- BANNER AREA (Gambar Terang, Teks Jelas) --- */}
        <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-[0_0_30px_rgba(20,184,166,0.03)] mb-3">
          
          {/* Cahaya Pemanis halus di pojok */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-[90px] z-0" />
          
          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex">
              {SLIDES.map((slide, index) => (
                <div className="flex-[0_0_100%] min-w-0 relative h-[250px] sm:h-[320px] flex items-center p-6 sm:p-12" key={index}>
                  
                  {/* Gambar Latar Belakang (Lebih Terang - Opacity 80%) */}
                  <img src={slide.bg} className="absolute inset-0 w-full h-full object-cover opacity-80 z-0" alt="" />
                  
                  {/* Overlay Hitam Tipis Merata agar teks terbaca */}
                  <div className="absolute inset-0 bg-black/20 z-1" />
                  
                  {/* Gradien Halus dari Bawah agar tombol menonjol */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-1" />

                  <div className="relative z-10 w-full">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/20 rounded-md px-2.5 py-0.5 mb-2.5 shadow-sm">
                      <Zap className="w-3.5 h-3.5 text-teal-400 fill-teal-400 animate-pulse shadow-[0_0_5px_#14b8a6]" />
                      <span className="text-[9px] text-teal-400 font-bold uppercase tracking-widest italic">{slide.category}</span>
                    </div>
                    
                    {/* Judul dengan Drop Shadow Kuat agar menonjol */}
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-2 italic tracking-tighter uppercase leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] sm:drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
                      {slide.title}
                    </h1>
                    
                    {/* Deskripsi dengan Drop Shadow Halus */}
                    <p className="text-zinc-200 text-xs sm:text-base mb-6 max-w-[280px] sm:max-w-md line-clamp-2 italic font-medium drop-shadow-[0_1px_5px_rgba(0,0,0,0.6)]">
                      {slide.desc}
                    </p>
                    
                    {/* Tombol */}
                    <div className="flex gap-3">
                      <Link href={slide.target} className="bg-teal-500 hover:bg-teal-400 text-black px-6 py-2.5 rounded-lg font-black text-xs uppercase flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] active:scale-95">
                        BELI <ChevronRight className="w-4 h-4" />
                      </Link>
                      <a href="https://wa.me/6285701961876" className="bg-zinc-800/80 border border-zinc-700 hover:bg-zinc-700 text-white px-6 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 transition-all">
                        <MessageCircle className="w-4 h-4" /> CHAT
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- 3 KOTAK STATS --- */}
        <div className="grid grid-cols-3 gap-2">
          {/* ... (bagian ini tetap sama, saya hapus untuk mempersingkat output) ... */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl py-3 text-center flex flex-col items-center justify-center min-h-[80px] shadow-inner hover:border-teal-500/20 transition-all">
            <Users className="w-5 h-5 text-teal-500 mb-1" />
            <div className="text-lg sm:text-2xl font-extrabold text-white leading-none italic">5000+</div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter mt-1">Pengguna</div>
          </div>
          {/* ... */}
        </div>

      </div>
    </section>
  );
}
