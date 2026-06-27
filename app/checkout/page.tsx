"use client";
import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { QRCodeSVG } from 'qrcode.react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = parseInt(searchParams.get("id") || "0");
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({ quantity: 1, whatsappNumber, customerName, product })
    });
    const data = await res.json();
    if (data.success) { setQrString(data.qrString); setOrderId(data.order_id); }
    else alert(data.error);
    setLoading(false);
  };

  if (!product) return <div className="p-10 text-center">Memuat...</div>;
  if (qrString) return <div className="flex flex-col items-center p-10"><h2 className="mb-4">Scan QRIS</h2><QRCodeSVG value={qrString} size={200} /><p>Menunggu pembayaran...</p></div>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="font-bold text-xl mb-4">{product.name}</h1>
      <input className="w-full border p-2 mb-2" placeholder="Nama Lengkap" onChange={e => setCustomerName(e.target.value)} />
      <input className="w-full border p-2 mb-2" placeholder="Nomor WhatsApp" onChange={e => setWhatsappNumber(e.target.value)} />
      <button onClick={handleCheckout} className="w-full bg-purple-600 text-white p-3 rounded" disabled={loading}>
        {loading ? "Memproses..." : "Bayar Sekarang"}
      </button>
    </div>
  );
}

export default function Page() { return <Suspense fallback={<div>Loading...</div>}><CheckoutContent /></Suspense>; }
