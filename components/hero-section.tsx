"use client";

import React, { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, Zap, Shield, Users } from "lucide-react";
import Link from "next/link";

const SLIDES = [
  {
    category: "SOURCE CODE",
    title: <>SC <span className="text-[#00e676]">BOT PREMIUM</span></>,
    desc: "Source code premium dengan fitur lengkap, ringan, aman, dan mudah digunakan untuk kebutuhan server harianmu.",
    bg: "https://picsum.photos/seed/banner1/1200/800",
    target: "#script"
  },
  {
    category: "FLASH SALE",
    title: <>DISKON <span className="text-[#00e676]">50% OFF</span></>,
    desc: "Akses instan aplikasi premium tanpa batas dengan harga distributor termurah khusus minggu ini.",
    bg: "https://picsum.photos/seed/banner2/1200/800",
    target: "#app"
  },
  {
    category: "DISTRIBUTOR",
    title: <>GARANSI <span className="text-[#00e676]">30 HARI</span></>,
    desc: "Layanan otomatis 24 jam nonstop dengan perlindungan garansi penuh selama satu bulan kalender.",
    bg: "https://picsum.photos/seed/banner3/1200/800",
    target: "#panel"
  }
];

export function HeroSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 45 });

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
    <section className="pt-20 pb-4 px-3 sm:px-6 bg-[#0c0c1e]">
      <div className="max-w-6xl mx-auto">
        
        {/* Container Banner */}
        <div className="relative rounded-[24px] overflow-hidden border border-white/5 bg-[#1a1a2e] shadow-[0_8px_30px_rgba(108,60,225,0.15)] mb-4">
          <div className="overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex">
              {SLIDES.map((slide, index) => (
                <div className="flex-[0_0_100%] min-w-0 relative aspect-[16/10.5] sm:h-[350px] flex items-center p-6 sm:p-12" key={index}>
                  <img src={slide.bg} className="absolute inset-0 w-full h-full object-cover opacity-90 z-0 pointer-events-none" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent z-1" />

                  <div className="relative z-10 w-full">
                    {/* Badge */}
                    <div className={`transition-all duration-700 delay-300 ${selectedIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="inline-flex items-center gap-1.5 bg-[#00bfa5]/10 border border-[#00bfa5]/30 rounded-lg px-3 py-[3px] mb-2.5">
                        <Zap className="w-3 h-3 text-[#00e676] fill-[#00e676] drop-shadow-[0_0_5px_#00e676]" />
                        <span className="text-[10px] text-[#00e676] font-bold uppercase tracking-widest italic">{slide.category}</span>
                      </div>
                    </div>
                    
                    {/* Judul Miring Premium */}
                    <h1 className={`text-2xl sm:text-4xl font-black text-white mb-1 italic tracking-tight uppercase leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-all duration-700 delay-500 ${selectedIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      {slide.title}
                    </h1>
                    
                    {/* Deskripsi */}
                    <p className={`text-zinc-200 text-[11px] sm:text-[13px] mb-5 max-w-[80%] sm:max-w-md italic font-light line-clamp-2 leading-relaxed transition-all duration-700 delay-700 ${selectedIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      {slide.desc}
                    </p>
                    
                    {/* Tombol Aksi */}
                    <div className={`transition-all duration-700 delay-1000 ${selectedIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <Link 
                        href={slide.target} 
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00bfa5] to-[#00e676] text-[#1a1a2e] px-5 py-2 rounded-xl font-extrabold text-[12px] tracking-wide shadow-[0_4px_15px_rgba(0,191,165,0.4)] transition-all active:scale-95"
                      >
                        LIHAT <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INDIKATOR KAPSUL SLIDER */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className="border-none p-0 cursor-pointer h-[6px] rounded-full transition-all duration-300 focus:outline-none"
                style={{
                  width: selectedIndex === index ? "22px" : "6px",
                  backgroundColor: selectedIndex === index ? "#00e676" : "rgba(255, 255, 255, 0.4)",
                  boxShadow: selectedIndex === index ? "0 0 10px rgba(0,230,118,0.6)" : "none"
                }}
              />
            ))}
          </div>
        </div>

        {/* STATS AREA */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-xl py-3 text-center flex flex-col items-center justify-center min-h-[70px] shadow-[0_4px_14px_rgba(108,60,225,0.04)] border border-[#6c3ce1]/5">
            <Users className="w-5 h-5 text-[#6C3CE1] mb-0.5" />
            <div className="text-base sm:text-2xl font-black text-[#1a1a2e] leading-none italic">5000+</div>
            <div className="text-[8px] sm:text-[10px] text-[#8a8aa8] font-bold uppercase mt-1 tracking-wide">Pengguna</div>
          </div>
          <div className="bg-white rounded-xl py-3 text-center flex flex-col items-center justify-center min-h-[70px] shadow-[0_4px_14px_rgba(108,60,225,0.04)] border border-[#6c3ce1]/5">
            <Zap className="w-5 h-5 text-amber-500 mb-0.5" />
            <div className="text-base sm:text-2xl font-black text-[#1a1a2e] leading-none italic">99.9%</div>
            <div className="text-[8px] sm:text-[10px] text-[#8a8aa8] font-bold uppercase mt-1 tracking-wide">Uptime</div>
          </div>
          <div className="bg-white rounded-xl py-3 text-center flex flex-col items-center justify-center min-h-[70px] shadow-[0_4px_14px_rgba(108,60,225,0.04)] border border-[#6c3ce1]/5">
            <Shield className="w-5 h-5 text-[#10b981] mb-0.5" />
            <div className="text-base sm:text-2xl font-black text-[#1a1a2e] leading-none italic">24/7</div>
            <div className="text-[8px] sm:text-[10px] text-[#8a8aa8] font-bold uppercase mt-1 tracking-wide">Support</div>
          </div>
        </div>

      </div>
    </section>
  );
}
