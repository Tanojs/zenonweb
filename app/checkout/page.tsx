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

interface Product {
  id: number;
  name: string;
  type: string;
  price: number;
  stock: number;
  is_ready: boolean;
  features: string[];
  delivery_info?: string;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = parseInt(searchParams.get("id") || "0");

  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>("");
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [qrString, setQrString] = useState<string>("");
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) {
        setLoadingProduct(false);
        return;
      }
      const { data, error } = await supabase.from('products').select('*').eq('id', productId).single();
      if (data) {
        setProduct(data);
        setQuantity(Math.min(1, data.stock));
      }
      setLoadingProduct(false);
    }
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (!orderId) return;
    const interval = setInterval(async () => {
      const { data } = await supabase.from('orders').select('status').eq('id', orderId).single();
      if (data?.status === 'paid') router.push(`/success?order_id=${orderId}`);
    }, 3000);
    return () => clearInterval(interval);
  }, [orderId, router]);

  const handleCheckout = async () => {
    if (!customerName.trim() || !whatsappNumber.trim()) return alert("Lengkapi data!");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: product?.price,
          quantity,
          whatsappNumber,
          customerName,
          product: { id: product?.id, name: product?.name, type: product?.type }
        })
      });
      const data = await res.json();
      if (data.success) { setQrString(data.qrString); setOrderId(data.order_id); }
      else alert(data.error || "Gagal memproses");
    } catch (err: any) { alert("Error: " + err.message); }
    finally { setLoading(false); }
  };

  if (loadingProduct) return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Produk tidak ditemukan</div>;

  const isOutOfStock = product.stock <= 0;

  if (qrString) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl text-center w-full max-w-sm">
        <h2 className="font-bold text-xl mb-4">Scan QRIS</h2>
        <div className="border-2 border-dashed border-gray-300 p-4 rounded-2xl mb-4">
          <QRCodeSVG value={qrString} size={220} className="mx-auto" />
        </div>
        <p className="text-sm text-gray-600">Menunggu pembayaran...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-md mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-4 text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-6">🛒 Detail Pesanan</h1>
          <div className="border border-gray-200 rounded-2xl p-4 mb-6">
            <p className="font-bold text-lg text-gray-800">{product.name}</p>
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
            <span className="text-sm font-semibold text-gray-600">JUMLAH BELI</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full bg-gray-200 font-bold text-xl">-</button>
              <span className="text-xl font-bold w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-8 h-8 rounded-full bg-gray-200 font-bold text-xl">+</button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">NAMA PEMBELI</label>
            <input className="w-full p-3 border rounded-xl" onChange={e => setCustomerName(e.target.value)} placeholder="Nama lengkap" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">NOMOR WHATSAPP</label>
            <input className="w-full p-3 border rounded-xl" onChange={e => setWhatsappNumber(e.target.value)} placeholder="+62..." />
          </div>

          <button onClick={handleCheckout} className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl">
            {loading ? "Memproses..." : "BELI SEKARANG"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<div>Loading...</div>}><CheckoutContent /></Suspense>;
}
