"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ALL_PRODUCTS } from "@/components/products-section";
import { QRCodeSVG } from 'qrcode.react';
import { X, Loader2 } from "lucide-react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [qrString, setQrString] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);

  const productId = parseInt(searchParams.get("id") || "0");
  const product = ALL_PRODUCTS.find((p) => p.id === productId);

  if (!product) return <div className="p-10 text-center">Produk tidak ditemukan</div>;

  const handleActionBayar = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: product.price, quantity })
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

  if (qrString) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="bg-card border p-6 rounded-2xl text-center shadow-xl">
          <h2 className="font-bold text-lg mb-4">Scan QRIS untuk Bayar</h2>
          <div className="bg-white p-2 inline-block rounded-lg">
             <QRCodeSVG value={qrString} size={250} />
          </div>
          <p className="text-xs text-muted-foreground mt-4">Scan di DANA, GOPAY, atau OVO Anda.</p>
          <button onClick={() => window.location.reload()} className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-xl text-xs font-bold">Kembali</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">{product.name}</h1>
      <button 
        onClick={handleActionBayar} 
        disabled={loading}
        className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold"
      >
        {loading ? "Memproses..." : "Bayar Sekarang"}
      </button>
    </div>
  );
}

// ⚠️ INI BAGIAN YANG PENTING AGAR BUILD SUKSES
export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
