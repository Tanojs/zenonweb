"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "#products", label: "Produk" },
  { href: "#faq", label: "FAQ" },
];

const WHATSAPP_NUMBER = "6285701961876";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0c0c1e]/95 backdrop-blur-md border-b border-[#6c3ce1]/10">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo Tano Pedia Style */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-[#6C3CE1] to-[#a855f7] flex items-center justify-center shadow-lg shadow-[#6C3CE1]/20 overflow-hidden">
              <img 
                src="/images/logo.png" 
                alt="Logo Tano Pedia" 
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain" 
              />
            </div>
            <span className="font-extrabold text-white text-base sm:text-lg tracking-tight">Tano<span className="bg-gradient-to-r from-[#6C3CE1] to-[#a855f7] bg-clip-text text-transparent">Pedia</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-300 hover:text-[#6C3CE1] transition-colors font-semibold"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo, saya mau order`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6C3CE1] to-[#a855f7] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#6C3CE1]/25 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              Order Sekarang
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-zinc-300 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-3 sm:py-4 border-t border-[#6c3ce1]/10 bg-[#0c0c1e]/98">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm sm:text-base text-zinc-300 hover:text-[#6C3CE1] hover:bg-[#6c3ce1]/5 px-3 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo, saya mau order`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#6C3CE1] to-[#a855f7] text-white px-4 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-bold text-center mt-2 shadow-lg shadow-[#6C3CE1]/25"
              >
                <MessageCircle className="w-4 h-4" />
                Order Sekarang
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
