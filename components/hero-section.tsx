"use client";

import React, { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, Zap, Shield, Users } from "lucide-react";
import Link from "next/link";

const SLIDES = [
  {
    category: "PANEL PTERODACTYL",
    title: (
      <div className="pr-3 inline-block">
        HOSTING{" "}
        <span className="bg-gradient-to-r from-[#6C3CE1] to-[#a855f7] bg-clip-text text-transparent">
          PREMIUM
        </span>
      </div>
    ),
    desc: "Panel Pterodactyl dengan VPS legal premium, server stabil, performa cepat, uptime aman, dan online 24/7 nonstop.",
    bg: "/images/zenon-sc.jpg",
    target: "#panel"
  },
  {
    category: "SOURCE CODE",
    title: (
      <div className="pr-3 inline-block">
        SC{" "}
        <span className="bg-gradient-to-r from-[#6C3CE1] to-[#a855f7] bg-clip-text text-transparent">
          BOT
        </span>
      </div>
    ),
    desc: "Source code premium dengan fitur lengkap, ringan, aman, dan mudah digunakan.",
    bg: "/images/zenon-sc.jpg",
    target: "#script"
  },
  {
    category: "APP",
    title: (
      <div className="pr-3 inline-block">
        APP{" "}
        <span className="bg-gradient-to-r from-[#6C3CE1] to-[#a855f7] bg-clip-text text-transparent">
          PREMIUM
        </span>
      </div>
    ),
    desc: "Aplikasi premium murah dengan harga terjangkau dan kualitas terbaik.",
    bg: "/images/zenon-sc.jpg",
    target: "#app"
  }
];

export function HeroSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    duration: 45 
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);

    const intervalId = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      clearInterval(intervalId);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="pt-20 pb-4 px-3 sm:px-6 bg-background text-foreground transition-colors duration-300">
      <div className="max-w-6xl mx-auto">

        {/* Banner Utama */}
        <div className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-xl mb-3 transition-colors duration-300">
          <div className="overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex">
              {SLIDES.map((slide, index) => (
                <div className="flex-[0_0_100%] min-w-0 relative h-[260px] sm:h-[350px] flex items-center p-4 sm:p-12" key={index}>
                  <img src={slide.bg} className="absolute inset-0 w-full h-full object-cover opacity-80 z-0 scale-100 pointer-events-none" alt="" />
                  
                  {/* Overlay Gelap Samping */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-1" />

                  {/* Kotak Pelindung Konten */}
                  <div className="relative z-10 max-w-[85%] sm:max-w-md bg-black/40 backdrop-blur-md p-4 sm:p-6 rounded-xl border border-white/10 shadow-lg">
                    
                    {/* 1. Badge */}
                    <div className={`transition-all duration-700 delay-300 ${selectedIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="inline-flex items-center gap-1.5 bg-[#6C3CE1]/30 border border-[#6C3CE1]/40 rounded-md px-2 py-0.5 mb-2">
                        <Zap className="w-3 h-3 text-[#a855f7] fill-[#a855f7]" />
                        <span className="text-[9px] text-purple-300 font-bold uppercase tracking-widest italic">{slide.category}</span>
                      </div>
                    </div>

                    {/* 2. Judul (Aman dari Potongan Font Italic) */}
                    <h1 className={`text-xl sm:text-3xl font-black text-white mb-1.5 italic tracking-tighter uppercase leading-tight transition-all duration-700 delay-500 ${selectedIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      {slide.title}
                    </h1>

                    {/* 3. Deskripsi */}
                    <p className={`text-zinc-200 text-[10px] sm:text-[13px] mb-4 italic font-light line-clamp-2 sm:line-clamp-none leading-relaxed transition-all duration-700 delay-700 ${selectedIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      {slide.desc}
                    </p>

                    {/* 4. Tombol */}
                    <div className={`transition-all duration-700 delay-1000 ${selectedIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <Link 
                        href={slide.target} 
                        className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#6C3CE1] to-[#a855f7] text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg font-black text-[10px] uppercase transition-all shadow-lg active:scale-95 shadow-[#6C3CE1]/25 cursor-pointer"
                      >
                        LIHAT <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- PAGINATION DOTS --- */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className="group relative flex items-center h-4 focus:outline-none cursor-pointer"
                style={{
                  width: selectedIndex === index ? "32px" : "10px",
                  transition: "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)"
                }}
              >
                <div 
                  className={`h-1.5 w-full rounded-full transition-all duration-500 ${
                    selectedIndex === index 
                      ? "bg-[#6C3CE1] shadow-[0_0_12px_rgba(108,60,225,0.8)]" 
                      : "bg-white/30 group-hover:bg-white/50"
                  }`} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* --- STATS AREA --- */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-card border border-border rounded-xl py-3 text-center flex flex-col items-center justify-center min-h-[75px] shadow-sm transition-colors duration-300">
            <Users className="w-5 h-5 text-[#6C3CE1] mb-1" />
            <div className="text-base sm:text-2xl font-black text-foreground leading-none italic">5000+</div>
            <div className="text-[8px] sm:text-[10px] text-muted-foreground font-bold uppercase mt-1">Pengguna</div>
          </div>
          <div className="bg-card border border-border rounded-xl py-3 text-center flex flex-col items-center justify-center min-h-[75px] shadow-sm transition-colors duration-300">
            <Zap className="w-5 h-5 text-amber-500 mb-1" />
            <div className="text-base sm:text-2xl font-black text-foreground leading-none italic">99.9%</div>
            <div className="text-[8px] sm:text-[10px] text-muted-foreground font-bold uppercase mt-1">Uptime</div>
          </div>
          <div className="bg-card border border-border rounded-xl py-3 text-center flex flex-col items-center justify-center min-h-[75px] shadow-sm transition-colors duration-300">
            <Shield className="w-5 h-5 text-emerald-500 mb-1" />
            <div className="text-base sm:text-2xl font-black text-foreground leading-none italic">24/7</div>
            <div className="text-[8px] sm:text-[10px] text-muted-foreground font-bold uppercase mt-1">Support</div>
          </div>
        </div>

      </div>
    </section>
  );
}
