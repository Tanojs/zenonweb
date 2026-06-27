"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ALL_PRODUCTS } from "@/components/products-section";
import { QRCodeSVG } from 'qrcode.react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [qrString, setQrString] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [wa, setWa] = useState<string>("");
  const [orderId, setOrderId] = useState<string | null>(null);

  const productId = parseInt(searchParams.get("id") || "0");
  const product = ALL_PRODUCTS.find((p) => p.id === productId);

  // Auto-Redirect ke halaman success
  useEffect(() => {
    if (!orderId) return;
    const interval = setInterval(async () => {
      const { data } = await supabase.from('orders').select('status').eq('id', orderId).single();
      if (data?.status === 'paid') router.push(`/success?order_id=${orderId}`);
    }, 3000);
    return () => clearInterval(interval);
  }, [orderId, router]);

  if (!product) return <div className="p-4 text-center">Produk tidak ditemukan</div>;

  const handleActionBayar = async () => {
    if (!wa) { alert("Masukkan nomor WhatsApp!"); return; }
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        price: product.price, 
        quantity, 
        whatsappNumber: wa, 
        product: product 
      })
    });
    const data = await res.json();
    if (data.success) {
      setQrString(data.qrString);
      setOrderId(data.order_id);
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
          <p>Menunggu pembayaran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans text-gray-800">
      <div className="max-w-md mx-auto bg-white p-6 rounded-[2rem] shadow-sm">
        <h2 className="font-bold text-xl mb-6">🛒 Detail Pesanan</h2>
        <div className="border border-gray-100 p-4 rounded-2xl mb-6">
          <p className="font-bold text-lg">{product.name}</p>
          <div className="flex justify-between font-bold text-purple-600">
            <span>HARGA</span>
            <span>Rp {product.price.toLocaleString()}</span>
          </div>
        </div>
        <input type="text" placeholder="Nomor WhatsApp" value={wa} onChange={(e) => setWa(e.target.value)} className="w-full p-4 border rounded-xl mb-6" />
        <button onClick={handleActionBayar} disabled={loading} className="w-full py-4 rounded-2xl bg-purple-600 text-white font-bold">
          {loading ? "..." : "BELI →"}
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<div>Loading...</div>}><CheckoutContent /></Suspense>;
}
