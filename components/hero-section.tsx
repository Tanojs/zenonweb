"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { MessageCircle, Zap, Shield, Users, ChevronRight } from "lucide-react";
import Link from "next/link";

const WHATSAPP_NUMBER = "6285701961876";

const SLIDES = [
  {
    title: <>Panel WhatsApp & <span className="text-teal-400">Script Bot WA</span></>,
    desc: "Beli produk premium untuk kebutuhan hosting anda secara otomatis & murah meriah hanya disini!",
    bg: "/images/hero-1.jpg",
  },
  {
    title: <>Next-Gen <span className="text-teal-400">Hosting Solutions</span></>,
    desc: "Solusi terpandu dengan 100+ fitur kami. No Delay. Free Update berkala.",
    bg: "/images/hero-2.jpg",
  }
];

const PRODUCTS = [
  "Panel Pterodactyl 1GB - Rp10.000",
  "Script Bot WA Basic - Rp15.000",
  "Panel Unlimited - Rp50.000",
  "Sewa Bot Raiden - Rp7.000",
  "Premium Script v7.2 - Rp35.000"
];

export function HeroSection() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })]);

  return (
    <section className="pt-16 sm:pt-20 pb-8 sm:pb-10 px-3 sm:px-4 lg:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* --- CAROUSEL BANNER --- */}
        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-700/80 bg-zinc-950" ref={emblaRef}>
          <div className="flex">
            {SLIDES.map((slide, index) => (
              <div className="flex-[0_0_100%] min-w-0 relative p-5 sm:p-8 md:p-10 lg:p-12 min-h-[350px] sm:min-h-[450px] flex items-center" key={index}>
                {/* Background Image */}
                <img src={slide.bg} className="absolute inset-0 w-full h-full object-cover opacity-30 z-0" alt="" />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent z-1" />

                <div className="relative z-10 w-full">
                  <div className="inline-flex items-center gap-1.5 bg-teal-400/15 border border-teal-400/40 rounded-full px-3 py-1 text-xs text-teal-400 mb-4 font-medium uppercase tracking-wider">
                    <Zap className="w-3 h-3" /> Aman & Terpercaya
                  </div>
                  <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight italic">
                    {slide.title}
                  </h1>
                  <p className="text-zinc-300 text-sm sm:text-lg max-w-xl mb-8 leading-relaxed">
                    {slide.desc}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="#products" className="inline-flex items-center justify-center gap-2 bg-teal-500 text-black px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-teal-500/30">
                      Lihat Produk <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- RUNNING TEXT (MARQUEE) --- */}
        <div className="mt-4 py-3 bg-zinc-900/50 border-y border-zinc-800 overflow-hidden relative rounded-lg">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...PRODUCTS, ...PRODUCTS].map((text, i) => (
              <span key={i} className="text-[10px] sm:text-xs font-bold text-teal-400/80 mx-6 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" /> {text}
              </span>
            ))}
          </div>
        </div>

        {/* --- STATS SECTION (Tetap dari kode lama) --- */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4">
          <div className="bg-zinc-900/90 border border-zinc-700/80 rounded-lg p-3 sm:p-4 text-center">
            <Users className="w-4 h-4 text-teal-400 mx-auto mb-1" />
            <div className="text-lg sm:text-2xl font-bold text-white">5000+</div>
            <div className="text-[10px] text-zinc-400">Pengguna</div>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-700/80 rounded-lg p-3 sm:p-4 text-center">
            <Zap className="w-4 h-4 text-teal-400 mx-auto mb-1" />
            <div className="text-lg sm:text-2xl font-bold text-white">99.9%</div>
            <div className="text-[10px] text-zinc-400">Uptime</div>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-700/80 rounded-lg p-3 sm:p-4 text-center">
            <Shield className="w-4 h-4 text-teal-400 mx-auto mb-1" />
            <div className="text-lg sm:text-2xl font-bold text-white">24/7</div>
            <div className="text-[10px] text-zinc-400">Support</div>
          </div>
        </div>

      </div>

      {/* --- ANIMATION STYLE --- */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
