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
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error || !data) {
        setProduct(null);
      } else {
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
      const { data } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single();
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
          quantity, whatsappNumber, customerName,
          product: { id: product?.id, name: product?.name, type: product?.type }
        })
      });
      const data = await res.json();
      if (data.success) {
        setQrString(data.qrString);
        setOrderId(data.order_id);
      } else {
        alert(data.error || "Gagal memproses");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Produk tidak ditemukan</div>;

  if (qrString) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl text-center w-full max-w-sm">
        <h2 className="font-bold text-xl mb-4">Scan QRIS</h2>
        <QRCodeSVG value={qrString} size={220} className="mx-auto" />
        <p className="mt-4 text-sm text-gray-600">Menunggu pembayaran...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-md mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h1 className="text-xl font-bold mb-6">🛒 Detail Pesanan</h1>
          <div className="border border-gray-200 rounded-2xl p-4 mb-6">
            <p className="font-bold">{product.name}</p>
            <p className="text-sm text-gray-600">{product.features?.join(", ") || "Produk digital"}</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">NAMA PEMBELI</label>
            <input className="w-full p-3 border rounded-xl" onChange={e => setCustomerName(e.target.value)} placeholder="Masukkan nama" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">NOMOR WHATSAPP</label>
            <input className="w-full p-3 border rounded-xl" onChange={e => setWhatsappNumber(e.target.value)} placeholder="+62..." />
          </div>
          <div className="flex justify-between items-center py-4 border-t">
            <span className="font-bold">TOTAL</span>
            <span className="text-2xl font-bold text-purple-700">Rp {(product.price * quantity).toLocaleString()}</span>
          </div>
          <button onClick={handleCheckout} className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl">
            {loading ? "Memproses..." : "BELI SEKARANG →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<div>Loading...</div>}><CheckoutContent /></Suspense>;
}
