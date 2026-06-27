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
      <div className="p-4 flex justify-center"><div className="bg-white p-6 rounded-2xl shadow-lg text-center">
        <h2 className="font-bold mb-4">Scan QRIS</h2>
        <QRCodeSVG value={qrString} size={250} />
        <button onClick={() => window.location.reload()} className="mt-4 w-full bg-gray-200 py-2 rounded-lg">Kembali</button>
      </div></div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Detail Pesanan */}
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
        <h2 className="font-bold text-lg mb-2">Detail Pesanan</h2>
        <div className="bg-purple-50 p-3 rounded-xl mb-2">
            <p className="font-semibold">{product.name}</p>
            <p className="text-sm text-gray-500">Harga Satuan: Rp {product.price.toLocaleString()}</p>
        </div>
      </div>

      {/* Jumlah Beli */}
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
        <label className="block text-sm font-medium mb-2">Jumlah Beli</label>
        <div className="flex items-center border rounded-xl overflow-hidden">
            <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-4 py-2 bg-gray-100">-</button>
            <input type="number" value={quantity} className="flex-1 text-center outline-none" readOnly />
            <button onClick={() => setQuantity(q => q+1)} className="px-4 py-2 bg-gray-100">+</button>
        </div>
      </div>

      {/* WhatsApp */}
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
        <label className="block text-sm font-medium mb-2">Nomor WhatsApp Aktif</label>
        <input type="text" placeholder="812xxxx" value={wa} onChange={(e) => setWa(e.target.value)} className="w-full p-3 border rounded-xl" />
      </div>

      {/* Total & Beli */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border-t">
        <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-green-600">TOTAL BAYAR</span>
            <span className="font-bold text-xl">Rp {(product.price * quantity).toLocaleString()}</span>
        </div>
        <button onClick={handleActionBayar} disabled={loading} className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold">
            {loading ? "Memproses..." : "BELI →"}
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<div>Loading...</div>}><CheckoutContent /></Suspense>;
}
