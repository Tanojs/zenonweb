"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { QRCodeSVG } from 'qrcode.react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = parseInt(searchParams.get("id") || "0");

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [qrString, setQrString] = useState("");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    supabase.from('products').select('*').eq('id', productId).single().then(({data}) => {
      setProduct(data);
    });
  }, [productId]);

  useEffect(() => {
    if (!orderId) return;
    const interval = setInterval(async () => {
      const { data } = await supabase.from('orders').select('status').eq('id', orderId).single();
      if (data?.status === 'paid') router.push(`/success?order_id=${orderId}`);
    }, 3000);
    return () => clearInterval(interval);
  }, [orderId]);

  const handleCheckout = async () => {
    if (!customerName || !whatsappNumber) return alert("Isi data dulu!");
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity, whatsappNumber, customerName, product: { id: product.id, name: product.name, type: product.type } })
    });
    const data = await res.json();
    if (data.success) { setQrString(data.qrString); setOrderId(data.order_id); }
    else alert(data.error);
    setLoading(false);
  };

  if (!product) return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;

  if (qrString) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl text-center w-full max-w-sm">
        <h2 className="font-bold text-xl mb-4">Scan QRIS</h2>
        <QRCodeSVG value={qrString} size={220} className="mx-auto" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg p-6">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 font-semibold text-sm text-gray-500">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <h1 className="text-xl font-bold mb-6">🛒 Detail Pesanan</h1>
        
        <div className="border border-gray-200 rounded-2xl p-4 mb-6">
          <p className="font-bold text-lg">{product.name}</p>
        </div>

        {/* --- TOMBOL QUANTITY DI SINI --- */}
        <div className="flex items-center justify-between mb-6">
          <span className="font-semibold text-gray-600">JUMLAH BELI</span>
          <div className="flex items-center gap-4">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full bg-gray-200 font-bold text-xl">-</button>
            <span className="text-xl font-bold">{quantity}</span>
            <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-xl">+</button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">NAMA PEMBELI</label>
          <input className="w-full p-3 border rounded-xl" onChange={e => setCustomerName(e.target.value)} />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">NOMOR WHATSAPP</label>
          <input className="w-full p-3 border rounded-xl" onChange={e => setWhatsappNumber(e.target.value)} placeholder="+62..." />
        </div>
        
        <button onClick={handleCheckout} className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl">
          {loading ? "Memproses..." : `BELI SEKARANG (Rp ${(product.price * quantity).toLocaleString()})`}
        </button>
      </div>
    </div>
  );
}

export default function Page() { return <Suspense fallback={<div>Loading...</div>}><CheckoutContent /></Suspense>; }
