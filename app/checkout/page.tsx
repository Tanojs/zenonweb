"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ALL_PRODUCTS } from "@/components/products-section";
import { QRCodeSVG } from 'qrcode.react'; // Tetap pakai ini karena sudah jalan
import { Loader2, ShieldCheck } from "lucide-react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [qrString, setQrString] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  
  const productId = parseInt(searchParams.get("id") || "0");
  const product = ALL_PRODUCTS.find((p) => p.id === productId);

  if (!product) return <div className="p-10 text-center text-white">Produk tidak ditemukan</div>;

  const handleActionBayar = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: product.price, quantity: 1 })
      });
      const res = await response.json();
      if (res.success) {
        setQrString(res.qrString);
      } else {
        alert("Error: " + res.error);
      }
    } catch (e) {
      alert("Terjadi kesalahan");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 flex justify-center items-center">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        
        {!qrString ? (
          <>
            <h2 className="text-xl font-bold text-white mb-2">Konfirmasi Pesanan</h2>
            <p className="text-slate-400 text-sm mb-6">Pastikan detail produk sudah benar.</p>
            
            <div className="bg-slate-800 p-4 rounded-2xl mb-6 border border-slate-700">
              <div className="flex justify-between items-center text-white">
                <span className="font-medium">{product.name}</span>
                <span className="font-bold">Rp {product.price.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={handleActionBayar}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold transition-all flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Bayar Sekarang"}
            </button>
          </>
        ) : (
          <div className="text-center animate-in fade-in zoom-in duration-500">
            <h2 className="text-white font-bold text-lg mb-4">Scan QRIS untuk Bayar</h2>
            <div className="bg-white p-3 rounded-xl inline-block mb-4">
               {/* Tetap menggunakan library yang sudah jalan di HP-mu */}
               <QRCodeSVG value={qrString} size={250} />
            </div>
            <div className="bg-slate-800 p-3 rounded-lg flex items-center justify-center gap-2 text-emerald-400 text-xs border border-emerald-900/50">
              <ShieldCheck size={16} /> Pembayaran Terenkripsi Aman
            </div>
            <button onClick={() => window.location.reload()} className="mt-6 text-slate-500 text-sm hover:text-white underline">
              Batal / Pilih Metode Lain
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-white">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
