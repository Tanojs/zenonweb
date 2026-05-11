"use client";

import { Zap } from "lucide-react";
import Link from "next/link";

const WHATSAPP_NUMBER = "6285701961876";
const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029VbCUCFf5a24DCL3z4W40";

export function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 sm:py-8 px-3 sm:px-4 lg:px-6 border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs sm:text-sm text-zinc-400">
            <span>&copy; {currentYear} ZenonStore</span>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
            >
              Hubungi Admin
            </a>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <Link href="#products" className="text-zinc-300 hover:text-white transition-colors">
              Cek Order
            </Link>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <a
              href={WHATSAPP_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Channel WA
            </a>
          </div>

          
<div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20 overflow-hidden">
  <img 
    src="/images/logo.png" 
    className="w-4 h-4 sm:w-5 sm:h-5 object-contain" 
  />
</div>

            <span className="text-xs sm:text-sm text-zinc-300 font-medium">ZenonStore</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
