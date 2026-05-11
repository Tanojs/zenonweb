"use client";

import React, { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, Zap, Shield, Users } from "lucide-react";
import Link from "next/link";

const SLIDES = [
  {
    category: "PANEL PTERODACTYL",
    title: <>HOSTING <span className="text-teal-400">PREMIUM</span></>,
    desc: "Panel performa tinggi untuk bot & game server tanpa delay. Layanan kami menjamin uptime maksimal dengan harga yang sangat terjangkau untuk semua kalangan gamer.",
    bg: "/images/zenon-sc.jpg",
    target: "#panel"
  },
  {
    category: "SCRIPT BOT WA",
    title: <>BOT <span className="text-teal-400">OTOMATIS</span></>,
    desc: "Script bot WhatsApp fitur terlengkap 24 jam. Dilengkapi dengan fitur antispam, broadcast, dan manajemen grup otomatis yang sangat mudah digunakan oleh siapapun.",
    bg: "/images/zenon-sc.jpg",
    target: "#script"
  },
  {
    category: "MOBILE APP",
    title: <>APP <span className="text-teal-400">PREMIUM</span></>,
    desc: "Aplikasi Android & iOS premium untukmu. Nikmati akses fitur pro tanpa batas untuk meningkatkan produktivitas harian kamu dengan harga langganan yang sangat murah.",
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
    <section className="pt-20 pb-4 px-3 sm:px-6 bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        
        {/* --- BANNER AREA --- */}
        <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl mb-3">
          <div className="overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex">
              {SLIDES.map((slide, index) => (
                <div 
                  className="flex-[0_0_100%] min-w-0 relative h-[260px] sm:h-[350px] flex items-center p-6 sm:p-12" 
                  key={index}
                >
                  {/* FOTO BERSIH (TANPA ZOOM) */}
                  <img 
                    src={slide.bg} 
                    className="absolute inset-0 w-full h-full object-cover z-0 scale-100" 
                    alt="" 
                  />
                  
                  {/* FIX: GRADIENT DIHAPUS, DIGANTI OVERLAY RATA TIPIS BIAR GAK ADA BAGIAN GELAP */}
                  <div className="absolute inset-0 bg-black/30 z-1" />

                  <div className="relative z-10 w-full">
                    <div className={`transition-all duration-700 delay-300 ${selectedIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="inline-flex items-center gap-1.5 bg-teal-500/20 border border-teal-500/30 rounded-md px-2 py-0.5 mb-2.5">
                        <Zap className="w-3 h-3 text-teal-400 fill-teal-400 shadow-[0_0_5px_#14b8a6]" />
                        <span className="text-[9px] text-teal-400 font-bold uppercase tracking-widest italic">{slide.category}</span>
                      </div>
                    </div>
                    
                    <h1 className={`text-2xl sm:text-4xl font-black text-white mb-2 italic tracking-tighter uppercase leading-tight drop-shadow-md transition-all duration-700 delay-500 ${selectedIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      {slide.title}
                    </h1>
                    
                    <p className={`text-zinc-200 text-[10px] sm:text-[13px] mb-6 max-w-[280px] sm:max-w-md italic font-light line-clamp-3 leading-relaxed transition-all duration-700 delay-700 ${selectedIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      {slide.desc}
                    </p>
                    
                    <div className={`transition-all duration-700 delay-1000 ${selectedIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <Link href={slide.target} className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-black px-5 py-2.5 rounded-xl font-black text-[11px] uppercase transition-all shadow-lg active:scale-95">
                        LIHAT <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- PAGINATION DOTS (BERSIH & KECIL) --- */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className="group relative flex items-center focus:outline-none"
                style={{
                  width: selectedIndex === index ? "20px" : "6px",
                  transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              >
                <div 
                  className={`h-1 w-full rounded-full transition-all duration-500 ${
                    selectedIndex === index 
                      ? "bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]" 
                      : "bg-white/20 group-hover:bg-white/40"
                  }`} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* --- STATS AREA --- */}
        <div className="grid grid-cols-3 gap-2">
           <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl py-3 text-center flex flex-col items-center justify-center min-h-[75px]">
            <Users className="w-5 h-5 text-teal-500 mb-1" />
            <div className="text-base sm:text-2xl font-black text-white leading-none italic">5000+</div>
            <div className="text-[8px] sm:text-[10px] text-zinc-500 font-bold uppercase mt-1">Pengguna</div>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl py-3 text-center flex flex-col items-center justify-center min-h-[75px]">
            <Zap className="w-5 h-5 text-teal-400 mb-1" />
            <div className="text-base sm:text-2xl font-black text-white leading-none italic">99.9%</div>
            <div className="text-[8px] sm:text-[10px] text-zinc-500 font-bold uppercase mt-1">Uptime</div>
          </div>
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
