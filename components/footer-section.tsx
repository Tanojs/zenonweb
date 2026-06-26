"use client";

import { Zap } from "lucide-react";
import Link from "next/link";

const WHATSAPP_NUMBER = "6285701961876";
const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029VbCUCFf5a24DCL3z4W40";

export function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 px-3 sm:px-6 border-t border-[#6c3ce1]/10 bg-[#0c0c1e]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs sm:text-sm text-zinc-400">
            <span>&copy; {currentYear} TanoPedia</span>
            <span className="hidden sm:inline text-zinc-700">|</span>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6C3CE1] hover:text-[#a855f7] font-bold transition-colors"
            >
              Hubungi Admin
            </a>
            <span className="hidden sm:inline text-zinc-700">|</span>
            <Link href="#products" className="text-zinc-300 hover:text-white transition-colors font-medium">
              Cek Order
            </Link>
            <span className="hidden sm:inline text-zinc-700">|</span>
            <a
              href={WHATSAPP_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 hover:text-white transition-colors font-medium"
            >
              Channel WA
            </a>
          </div>

          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#6C3CE1] to-[#a855f7] flex items-center justify-center shadow-lg overflow-hidden">
              <img 
                src="/images/logo.png" 
                alt="Logo"
                className="w-3 h-3 object-contain" 
              />
            </div>
            <span className="text-xs sm:text-sm text-zinc-300 font-bold">Tano<span className="text-[#6C3CE1]">Pedia</span></span>
          </div>

        </div>
      </div>
    </footer>
  );
}
