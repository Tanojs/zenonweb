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
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Mengirim data ke API
        body: JSON.stringify({ price: product.price, quantity, whatsappNumber: wa })
      });
      const data = await res.json();
      if (data.success) setQrString(data.qrString);
      else alert(data.error);
    } catch (e) {
      alert("Terjadi kesalahan jaringan");
    }
    setLoading(false);
  };

  if (qrString) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center w-full max-w-sm">
          <h2 className="font-bold text-xl mb-4">Scan QRIS</h2>
          <div className="border p-2 rounded-xl mb-4">
            <QRCodeSVG value={qrString} size={250} className="mx-auto" />
          </div>
          <p className="text-sm text-gray-500 mb-6">Scan menggunakan aplikasi DANA/Gopay/OVO Anda.</p>
          <button onClick={() => window.location.reload()} className="w-full bg-gray-200 py-3 rounded-2xl font-bold">Kembali</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="bg-white p-4 rounded-3xl shadow-sm mb-4">
        <h2 className="font-bold text-lg mb-2">Detail Pesanan</h2>
        <div className="bg-purple-50 p-4 rounded-2xl">
            <p className="font-semibold">{product.name}</p>
            <p className="text-sm text-gray-500">Harga Satuan: Rp {product.price.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm mb-4">
        <label className="block text-sm font-medium mb-2">Jumlah Beli</label>
        <div className="flex items-center border rounded-2xl overflow-hidden">
            <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-6 py-3 bg-gray-100 font-bold">-</button>
            <input type="number" value={quantity} className="flex-1 text-center font-bold outline-none" readOnly />
            <button onClick={() => setQuantity(q => q+1)} className="px-6 py-3 bg-gray-100 font-bold">+</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm mb-4">
        <label className="block text-sm font-medium mb-2">Nomor WhatsApp Aktif</label>
        <input type="text" placeholder="812xxxx" value={wa} onChange={(e) => setWa(e.target.value)} className="w-full p-4 border rounded-2xl outline-none" />
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border-t">
        <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-green-600">TOTAL BAYAR</span>
            <span className="font-bold text-2xl">Rp {(product.price * quantity).toLocaleString()}</span>
        </div>
        <button onClick={handleActionBayar} disabled={loading} className="w-full bg-purple-600 text-white py-4 rounded-3xl font-bold text-lg shadow-lg">
            {loading ? "Memproses..." : "BELI →"}
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<div>Loading...</div>}><CheckoutContent /></Suspense>;
}
