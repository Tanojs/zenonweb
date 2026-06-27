"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { QRCodeSVG } from 'qrcode.react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Interface untuk produk dari database
interface Product {
  id: number;
  name: string;
  type: string;
  price: number;
  stock: number;
  is_ready: boolean;
  features: string[];
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [qrString, setQrString] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [wa, setWa] = useState<string>("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  const productId = parseInt(searchParams.get("id") || "0");

  // Ambil data produk dari Supabase berdasarkan ID
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
        console.error("Produk tidak ditemukan:", error);
        setProduct(null);
      } else {
        setProduct(data);
      }
      setLoadingProduct(false);
    }

    fetchProduct();
  }, [productId]);

  // Auto-Redirect ke halaman success jika status paid
  useEffect(() => {
    if (!orderId) return;
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single();
      if (data?.status === 'paid') {
        router.push(`/success?order_id=${orderId}`);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [orderId, router]);

  // Loading state
  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">Memuat produk...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center">
          <h2 className="font-bold text-xl text-red-600">Produk tidak ditemukan</h2>
          <p className="text-gray-500 mt-2">ID: {productId}</p>
        </div>
      </div>
    );
  }

  // Cek stok
  const isOutOfStock = product.stock <= 0;

  const handleActionBayar = async () => {
    if (!wa) {
      alert("Masukkan nomor WhatsApp!");
      return;
    }
    if (isOutOfStock) {
      alert("Maaf, stok produk ini habis!");
      return;
    }
    if (quantity < 1) {
      alert("Quantity minimal 1");
      return;
    }
    if (quantity > product.stock) {
      alert(`Stok tersisa ${product.stock}, tidak bisa beli lebih dari itu.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: product.price,
          quantity,
          whatsappNumber: wa,
          product: {
            id: product.id,
            name: product.name,
            type: product.type,
          }
        })
      });

      const data = await res.json();

      if (data.success) {
        setQrString(data.qrString);
        setOrderId(data.order_id);
      } else {
        alert(data.error || "Gagal memproses pembayaran");
      }
    } catch (err: any) {
      alert("Terjadi kesalahan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Tampilan QR Code
  if (qrString) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center w-full max-w-sm">
          <h2 className="font-bold text-xl mb-6">Scan QRIS</h2>
          <div className="border-2 border-dashed p-4 rounded-2xl mb-6">
            <QRCodeSVG value={qrString} size={220} className="mx-auto" />
          </div>
          <p className="text-sm text-gray-600">Menunggu pembayaran...</p>
          <p className="text-xs text-gray-400 mt-2">Total: Rp {product.price * quantity}</p>
        </div>
      </div>
    );
  }

  // Tampilan form checkout
  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans text-gray-800">
      <div className="max-w-md mx-auto bg-white p-6 rounded-[2rem] shadow-sm">
        <h2 className="font-bold text-xl mb-6">🛒 Detail Pesanan</h2>

        <div className="border border-gray-100 p-4 rounded-2xl mb-6">
          <p className="font-bold text-lg">{product.name}</p>
          <div className="flex justify-between font-bold text-purple-600 mt-1">
            <span>Harga</span>
            <span>Rp {product.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>Stok tersedia</span>
            <span>{product.stock}</span>
          </div>
        </div>

        {/* Input Quantity */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Jumlah</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-xl font-bold flex items-center justify-center"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="text-xl font-bold w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-xl font-bold flex items-center justify-center"
              disabled={quantity >= product.stock}
            >
              +
            </button>
            <span className="text-sm text-gray-500 ml-2">Max {product.stock}</span>
          </div>
        </div>

        {/* Input WhatsApp */}
        <input
          type="text"
          placeholder="Nomor WhatsApp (contoh: 08123456789)"
          value={wa}
          onChange={(e) => setWa(e.target.value)}
          className="w-full p-4 border rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        {/* Total */}
        <div className="flex justify-between font-bold text-lg mb-6 border-t pt-4">
          <span>Total</span>
          <span className="text-purple-600">Rp {(product.price * quantity).toLocaleString()}</span>
        </div>

        {/* Tombol Beli */}
        <button
          onClick={handleActionBayar}
          disabled={loading || isOutOfStock}
          className={`w-full py-4 rounded-2xl text-white font-bold transition-all ${
            isOutOfStock
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 active:scale-95"
          }`}
        >
          {loading
            ? "Memproses..."
            : isOutOfStock
            ? "STOK HABIS"
            : `BAYAR Rp ${(product.price * quantity).toLocaleString()} →`}
        </button>

        {isOutOfStock && (
          <p className="text-red-500 text-sm text-center mt-3">Maaf, stok produk ini habis.</p>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}