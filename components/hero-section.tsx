"use client";

import { MessageCircle, Zap, Shield, Users } from "lucide-react";
import Link from "next/link";

const WHATSAPP_NUMBER = "6285701961876";

export function HeroSection() {
  return (
    <section className="pt-16 sm:pt-20 pb-8 sm:pb-10 px-3 sm:px-4 lg:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Banner */}
        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-teal-500/15 via-zinc-900 to-teal-500/10 border border-zinc-700/80 p-5 sm:p-8 md:p-10 lg:p-12">
          {/* Glow Effect */}
          <div className="absolute top-0 right-0 w-48 sm:w-72 h-48 sm:h-72 bg-teal-400/15 rounded-full blur-[100px] sm:blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-40 sm:w-56 h-40 sm:h-56 bg-teal-400/10 rounded-full blur-[80px] sm:blur-[100px]" />

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-teal-400/15 border border-teal-400/40 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm text-teal-400 mb-4 sm:mb-5 font-medium">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
              Aman & Terpercaya 
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              Panel WhatsApp &{" "}
              <span className="text-teal-400">Script Bot WA</span>
            </h1>

            {/* Description */}
            <p className="text-zinc-300 text-sm sm:text-base md:text-lg max-w-2xl mb-5 sm:mb-8 leading-relaxed">
              Beli produk premium untuk kebutuhan hosting anda secara otomatis &
              murah meriah hanya disini! Panel berkualitas dengan harga terjangkau.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="#products"
                className="inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all shadow-lg shadow-teal-500/30 hover:shadow-teal-400/40"
              >
                Lihat Produk
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo, saya mau order panel/script`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Chat WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-8">
          <div className="bg-zinc-900/90 border border-zinc-700/80 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center hover:border-teal-400/50 transition-colors">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">5000+</div>
            <div className="text-[10px] sm:text-xs text-zinc-400 font-medium">Pengguna</div>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-700/80 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center hover:border-teal-400/50 transition-colors">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">99.9%</div>
            <div className="text-[10px] sm:text-xs text-zinc-400 font-medium">Uptime</div>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-700/80 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center hover:border-teal-400/50 transition-colors">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">24/7</div>
            <div className="text-[10px] sm:text-xs text-zinc-400 font-medium">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}