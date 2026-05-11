"use client";

import React, { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, Zap, Shield, Users } from "lucide-react";
import Link from "next/link";

const SLIDES = [
  {
    category: "PANEL PTERODACTYL",
    title: <>HOSTING <span className="text-teal-400">PREMIUM</span></>,
    desc: "Panel performa tinggi untuk bot & game server tanpa delay.",
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
    bg: "/images/zenon-sc.jpg",
    target: "#app"
  }
];

export function HeroSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    duration: 40, 
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
        
        <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl mb-3">
          <div className="overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex">
              {SLIDES.map((slide, index) => (
                <div 
                  className="flex-[0_0_100%] min-w-0 relative h-[230px] sm:h-[320px] flex items-center p-6 sm:p-12 transition-opacity duration-1000" 
                  key={index}
                >
                  {/* FIX: scale-110 dihapus, gambar sekarang fix scale-100 (tidak nge-zoom) */}
                  <img 
                    src={slide.bg} 
                    className="absolute inset-0 w-full h-full object-cover opacity-90 z-0 scale-100" 
                    alt="" 
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-1" />

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
                    
                    <p className={`text-zinc-200 text-[10px] sm:text-sm mb-6 max-w-[250px] line-clamp-1 italic font-light transition-all duration-700 delay-700 ${selectedIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
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

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`transition-all duration-500 rounded-full focus:outline-none ${
                  selectedIndex === index 
                    ? "w-8 h-1.5 bg-teal-500 shadow-[0_0_10px_#14b8a6]" 
                    : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

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
