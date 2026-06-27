"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ALL_PRODUCTS } from "@/components/products-section";
import { QRCodeSVG } from 'qrcode.react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [qrString, setQrString] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [wa, setWa] = useState<string>("");

  const productId = parseInt(searchParams.get("id") || "0");
  const product = ALL_PRODUCTS.find((p) => p.id === productId);

  if (!product) return <div className="p-4 text-center">Produk tidak ditemukan</div>;

  const handleActionBayar = async () => {
    if (!wa) { alert("Masukkan nomor WhatsApp!"); return; }
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: product.price, quantity, whatsappNumber: wa })
    });
    const data = await res.json();
    if (data.success) setQrString(data.qrString);
    else alert(data.error);
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
          <button onClick={() => window.location.reload()} className="w-full bg-gray-800 text-white py-3 rounded-xl font-bold">Kembali</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans text-gray-800">
      <div className="max-w-md mx-auto bg-white p-6 rounded-[2rem] shadow-sm">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-xl">🛒 Detail Pesanan</h2>
        </div>

        {/* Product Card */}
        <div className="border border-gray-100 p-4 rounded-2xl mb-6">
          <p className="font-bold text-lg">{product.name}</p>
          <p className="text-sm text-gray-500 mb-4">PRO TEAM PLAN, 1 MINGGU RANDOM...</p>
          <div className="flex justify-between items-center font-bold text-purple-600">
            <span>HARGA SATUAN</span>
            <span>Rp {product.price.toLocaleString()}</span>
          </div>
        </div>

        {/* Quantity */}
        <label className="text-sm font-bold mb-2 block">JUMLAH BELI</label>
        <div className="flex items-center border-2 border-gray-100 rounded-xl mb-6">
          <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-6 py-3 font-bold text-lg">-</button>
          <input type="number" value={quantity} className="flex-1 text-center font-bold outline-none" readOnly />
          <button onClick={() => setQuantity(q => q+1)} className="px-6 py-3 font-bold text-lg">+</button>
        </div>

        {/* WhatsApp */}
        <label className="text-sm font-bold mb-2 block">NOMOR WHATSAPP AKTIF</label>
        <input type="text" placeholder="812xxxx" value={wa} onChange={(e) => setWa(e.target.value)} className="w-full p-4 border-2 border-gray-100 rounded-xl mb-6 outline-none focus:border-purple-300" />

        {/* Total & Action */}
        <div className="bg-green-50 p-4 rounded-2xl flex justify-between items-center mb-6">
          <span className="font-bold text-green-700">TOTAL BAYAR</span>
          <span className="font-bold text-xl text-green-700">Rp {(product.price * quantity).toLocaleString()}</span>
        </div>

        <div className="flex gap-4">
          <button className="w-1/3 py-4 rounded-2xl border-2 border-gray-200 font-bold">BATAL</button>
          <button onClick={handleActionBayar} disabled={loading} className="w-2/3 py-4 rounded-2xl bg-purple-600 text-white font-bold text-lg">
            {loading ? "..." : "BELI →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<div>Loading...</div>}><CheckoutContent /></Suspense>;
}
