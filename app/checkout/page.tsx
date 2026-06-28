"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { QRCodeSVG } from 'qrcode.react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

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
    supabase.from('products').select('*').eq('id', productId).single().then(({data}) => setProduct(data));
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
    if (!customerName || !whatsappNumber) return alert("Isi data lengkap!");
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity, whatsappNumber, customerName, product, price: product.price })
    });
    const data = await res.json();
    if (data.success) { setQrString(data.qrString); setOrderId(data.order_id); }
    else alert(data.error);
    setLoading(false);
  };

  if (!product) return <div className="p-10 text-center">Memuat...</div>;
  if (qrString) return <div className="flex flex-col items-center p-10"><h2 className="mb-4">Scan QRIS</h2><QRCodeSVG value={qrString} size={200} /><p>Menunggu pembayaran...</p></div>;

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg p-6">
        <h1 className="text-xl font-bold mb-4">{product.name}</h1>
        <div className="flex items-center justify-between mb-4">
          <span>Jumlah:</span>
          <div className="flex items-center gap-4">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="bg-gray-200 px-4 py-1 rounded-full">-</button>
            <span className="font-bold">{quantity}</span>
            <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="bg-purple-600 text-white px-4 py-1 rounded-full">+</button>
          </div>
        </div>
        <input className="w-full border p-3 mb-2 rounded-xl" placeholder="Nama Lengkap" onChange={e => setCustomerName(e.target.value)} />
        <input className="w-full border p-3 mb-4 rounded-xl" placeholder="Nomor WhatsApp" onChange={e => setWhatsappNumber(e.target.value)} />
        <button onClick={handleCheckout} className="w-full bg-purple-600 text-white p-3 rounded-xl font-bold" disabled={loading}>
          {loading ? "Memproses..." : "BELI SEKARANG"}
        </button>
      </div>
    </div>
  );
}

export default function Page() { return <Suspense fallback={<div>Loading...</div>}><CheckoutContent /></Suspense>; }
