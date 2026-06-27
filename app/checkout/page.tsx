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
        console.error("Produk tidak ditemukan:", error);
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

      if (data?.status === 'paid') {
        router.push(`/success?order_id=${orderId}`);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId, router]);

  const handleCheckout = async () => {
    if (!customerName.trim()) {
      alert("Masukkan nama lengkap!");
      return;
    }
    if (!whatsappNumber.trim()) {
      alert("Masukkan nomor WhatsApp!");
      return;
    }
    if (quantity < 1) {
      alert("Minimal beli 1!");
      return;
    }
    if (!product) {
      alert("Produk tidak ditemukan!");
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
          quantity: quantity,
          whatsappNumber: whatsappNumber,
          customerName: customerName,
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

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center text-gray-600">Memuat produk...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-sm w-full">
          <h2 className="font-bold text-xl text-red-600">Produk tidak ditemukan</h2>
          <p className="text-gray-500 text-sm mt-2">ID: {productId}</p>
          <Link href="/" className="mt-4 inline-block text-purple-600 font-bold text-sm">
            ← Kembali ke Home
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  if (qrString) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center w-full max-w-sm">
          <h2 className="font-bold text-xl mb-4">Scan QRIS</h2>
          <div className="border-2 border-dashed border-gray-300 p-4 rounded-2xl mb-4">
            <QRCodeSVG value={qrString} size={220} className="mx-auto" />
          </div>
          <p className="text-sm text-gray-600">Menunggu pembayaran...</p>
          <p className="text-xs text-gray-400 mt-2">
            Total: Rp {(product.price * quantity).toLocaleString()}
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 text-purple-600 font-bold text-sm"
          >
            ← Kembali ke Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-md mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-4 text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>

        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-6">🛒 Detail Pesanan</h1>

          <div className="border border-gray-200 rounded-2xl p-4 mb-6">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">ITEM DIPILIH</p>
            <p className="font-bold text-lg text-gray-800">{product.name}</p>
            <p className="text-sm text-gray-600 mt-1">{product.features?.join(", ") || "Produk digital"}</p>
          </div>

          <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
            <span className="text-sm font-semibold text-gray-600">HARGA SATUAN</span>
            <span className="font-bold text-gray-800">Rp {product.price.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
            <span className="text-sm font-semibold text-gray-600">JUMLAH BELI</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || isOutOfStock}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-xl font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="text-xl font-bold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock || isOutOfStock}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-xl font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          </div>

          <div className="bg-purple-50 rounded-2xl p-4 mb-6">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">METODE PEMBAYARAN</p>
            <p className="font-bold text-purple-700">QRIS (Otomatis)</p>
            <p className="text-xs text-gray-500 mt-1">Scan via DANA, GoPay, OVO, ShopeePay, dll.</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600 mb-1">NAMA PEMBELI</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600 mb-1">NOMOR WHATSAPP AKTIF</label>
            <input
              type="tel"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="62812xxxxxx"
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
            />
          </div>

          <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-6">
            <span className="text-sm font-bold text-gray-600">TOTAL BAYAR</span>
            <span className="text-2xl font-bold text-purple-700">
              Rp {(product.price * quantity).toLocaleString()}
            </span>
          </div>

          {isOutOfStock && (
            <div className="bg-red-50 p-3 rounded-xl mb-4 border border-red-200">
              <p className="text-red-600 text-sm font-bold text-center">⚠️ Stok produk ini habis!</p>
            </div>
          )}

          <div className="flex gap-3">
            <Link
              href="/"
              className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-bold text-center hover:bg-gray-50 transition"
            >
              BATAL
            </Link>
            <button
              onClick={handleCheckout}
              disabled={loading || isOutOfStock}
              className={`flex-1 py-3 rounded-xl text-white font-bold transition-all ${
                isOutOfStock
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 active:scale-95"
              }`}
            >
              {loading ? "Memproses..." : isOutOfStock ? "STOK HABIS" : "BELI SEKARANG"}
            </button>
          </div>
        </div>
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