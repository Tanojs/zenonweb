"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, MessageCircle, Zap } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "#products", label: "Produk" },
  { href: "#faq", label: "FAQ" },
];

const WHATSAPP_NUMBER = "6285701961876";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20 overflow-hidden">
  <img 
    src="images/logo.png" 
    alt="Logo Zenon" 
    className="w-6 h-6 sm:w-7 sm:h-7 object-contain" 
  />
</div>
            <span className="font-bold text-white text-base sm:text-lg">ZenonStore</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-300 hover:text-teal-400 transition-colors font-medium"
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
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-black px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-teal-500/25"
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
          <div className="md:hidden py-3 sm:py-4 border-t border-zinc-800 bg-zinc-950/95">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm sm:text-base text-zinc-300 hover:text-teal-400 hover:bg-zinc-800/50 px-3 py-2.5 sm:py-3 rounded-lg font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo, saya mau order`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-black px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-bold text-center mt-2 shadow-lg shadow-teal-500/25"
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
