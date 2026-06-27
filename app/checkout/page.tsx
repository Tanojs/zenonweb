"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ALL_PRODUCTS } from "@/components/products-section";
import { QRCodeSVG } from 'qrcode.react';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase (Pastikan variabel di Vercel sesuai)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter(); // Gunakan router untuk pindah halaman
  const [qrString, setQrString] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [wa, setWa] = useState<string>("");
  const [orderId, setOrderId] = useState<string | null>(null); // Simpan ID order di sini

  const productId = parseInt(searchParams.get("id") || "0");
  const product = ALL_PRODUCTS.find((p) => p.id === productId);

  // LOGIKA: Cek status pembayaran otomatis setiap 3 detik
  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single();

      if (data?.status === 'paid') {
        router.push(`/success?order_id=${orderId}`);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId, router]);

  if (!product) return <div className="p-4 text-center">Produk tidak ditemukan</div>;

  const handleActionBayar = async () => {
    if (!wa) { alert("Masukkan nomor WhatsApp!"); return; }
    setLoading(true);
    
    // 1. Panggil API untuk generate QRIS
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: product.price, quantity, whatsappNumber: wa })
    });
    
    const data = await res.json();
    if (data.success) {
      setQrString(data.qrString);
      setOrderId(data.order_id); // Simpan order_id yang diterima dari API
    } else {
      alert(data.error);
    }
    setLoading(false);
  };

  if (qrString) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center w-full max-w-sm">
          <h2 className="font-bold text-xl mb-6">Scan QRIS</h2>
          <div className="border-2 border-dashed p-4 rounded-2xl mb-6">
            <QRCodeSVG value={qrString} size={220} className="mx-auto" />
          </div>
          <p className="text-sm text-gray-500 mb-4">Menunggu pembayaran terdeteksi...</p>
        </div>
      </div>
    );
  }

  // ... (Sisa kode tampilan checkout tetap sama seperti sebelumnya)
  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans text-gray-800">
      <div className="max-w-md mx-auto bg-white p-6 rounded-[2rem] shadow-sm">
        <h2 className="font-bold text-xl mb-6">🛒 Detail Pesanan</h2>
        {/* ... (isi card produk, quantity, wa, tombol beli) */}
        <button onClick={handleActionBayar} disabled={loading} className="w-full py-4 rounded-2xl bg-purple-600 text-white font-bold text-lg">
          {loading ? "..." : "BELI →"}
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<div>Loading...</div>}><CheckoutContent /></Suspense>;
}
