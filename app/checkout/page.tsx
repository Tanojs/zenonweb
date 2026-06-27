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

  if (!product) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (qrString) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl text-center w-full max-w-sm">
        <h2 className="font-bold text-xl mb-4">Scan QRIS</h2>
        <div className="border-2 border-dashed border-gray-300 p-4 rounded-2xl mb-4">
          <QRCodeSVG value={qrString} size={220} className="mx-auto" />
        </div>
        <p>Menunggu pembayaran...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg p-6">
        <h1 className="text-xl font-bold mb-6">🛒 Detail Pesanan</h1>
        <div className="mb-4">
          <p className="font-bold text-lg">{product.name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600">NAMA PEMBELI</label>
          <input className="w-full p-3 border rounded-xl" placeholder="Nama lengkap" onChange={e => setCustomerName(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600">NOMOR WHATSAPP</label>
          <input className="w-full p-3 border rounded-xl" placeholder="+62 812..." onChange={e => setWhatsappNumber(e.target.value)} />
        </div>
        <button onClick={handleCheckout} className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl" disabled={loading}>
          {loading ? "Memproses..." : "BELI SEKARANG →"}
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<div>Loading...</div>}><CheckoutContent /></Suspense>;
}
