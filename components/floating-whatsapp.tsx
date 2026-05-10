"use client";

import { MessageCircle } from "lucide-react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { useRef } from "react";

const WHATSAPP_NUMBER = "6285701961876";

export function FloatingWhatsApp() {
  const controls = useAnimation();
  const containerRef = useRef<HTMLAnchorElement>(null);

  // Fungsi saat jari/kursor melepas tombol
  const handleDragEnd = (_: any, info: PanInfo) => {
    // 1. Ambil ukuran layar saat ini
    const width = window.innerWidth;
    
    // 2. Ambil posisi X terakhir tombol (info.point.x)
    const endX = info.point.x;

    // Jarak aman dari pinggir layar (misal 20px)
    const edgeOffset = 20;
    const buttonWidth = 48; // w-12 = 48px

    let targetX = 0;

    // 3. Logika Snap: Tentukan pinggir terdekat (Kiri atau Kanan)
    if (endX > width / 2) {
      // Jika di kanan layar, lompat ke kanan
      // (Position fixed kita pakai right-5, jadi targetX ke 0 biar balik ke right-5 asli)
      targetX = 0; 
    } else {
      // Jika di kiri layar, lompat ke kiri
      // Kita hitung jaraknya: -(LebarLayar - OffsetKananAsli - LebarTombol - OffsetKiri)
      targetX = -(width - edgeOffset - buttonWidth - edgeOffset); 
    }

    // 4. Jalankan animasi lompat (Spring agar halus)
    controls.start({
      x: targetX,
      transition: { 
        type: "spring", 
        stiffness: 200, // Kekencangan per
        damping: 20      // Kelembutan per
      },
    });
  };

  return (
    <motion.a
      ref={containerRef}
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo, saya mau tanya tentang produk`}
      target="_blank"
      rel="noopener noreferrer"
      
      // FITUR DRAG
      drag
      dragElastic={0} // 0 biar nempel total di jari (nggak membal)
      dragMomentum={false} // Matikan momentum biar nggak selip
      animate={controls} // Hubungkan dengan controls animasi snap
      onDragEnd={handleDragEnd} // Panggil fungsi snap saat dilepas
      
      // Batas seret agar tidak hilang keluar layar (secara vertikal)
      dragConstraints={{ top: -window.innerHeight + 100, bottom: 0 }} 

      whileDrag={{ scale: 1.1, cursor: "grabbing" }}
      
      // POSISI AWAL (Fixed di kanan bawah)
      className="fixed bottom-5 right-5 z-50 w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl cursor-grab active:cursor-grabbing"
    >
      <MessageCircle className="w-6 h-6 text-white" />
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 pointer-events-none" />
    </motion.a>
  );
}
