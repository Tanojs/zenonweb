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
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('products').select('*').eq('id', productId).single().then(({data}) => setProduct(data));
  }, [productId]);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity, whatsappNumber, customerName,
          product: { id: product.id, name: product.name, type: product.type }
        })
      });
      const data = await res.json();
      if (data.success) {
        setQrString(data.qrString);
        setOrderId(data.order_id);
      } else {
        alert(data.error);
      }
    } catch (err) { alert("Gagal"); }
    finally { setLoading(false); }
  };

  if (!product) return <div className="p-10 text-center">Loading...</div>;

  if (qrString) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="font-bold text-xl mb-4">Scan QRIS</h2>
      <QRCodeSVG value={qrString} size={220} />
      <p className="mt-4">Menunggu pembayaran...</p>
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">{product.name}</h1>
      <input className="w-full border p-2 mb-2" placeholder="Nama" onChange={e => setCustomerName(e.target.value)} />
      <input className="w-full border p-2 mb-2" placeholder="WhatsApp" onChange={e => setWhatsappNumber(e.target.value)} />
      <button onClick={handleCheckout} className="w-full bg-purple-600 text-white p-3 rounded-lg" disabled={loading}>
        {loading ? "Memproses..." : "Bayar Sekarang"}
      </button>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<div>Loading...</div>}><CheckoutContent /></Suspense>;
}
