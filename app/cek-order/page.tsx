"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, Search, Loader2, Copy, Check, Clock, CheckCircle2 } from "lucide-react";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function CekOrderPage() {
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchKey.trim()) return;
    setLoading(true);
    const key = searchKey.trim();
    const { data } = await supabase
      .from("orders")
      .select("*")
      .or(`customer_phone.eq.${key},id.eq.${key},order_display_id.eq.${key}`)
      .order("created_at", { ascending: false });
    setResults(data && data.length > 0 ? data : null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>

        <h1 className="text-2xl font-bold mb-6 text-gray-800">Cek Status Pesanan</h1>

        <form onSubmit={handleSearch} className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 flex gap-2 mb-8">
          <input
            className="flex-1 bg-transparent px-4 py-3 outline-none text-sm"
            placeholder="Ketik ORD-xxxx atau No. WA..."
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <button className="bg-purple-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-purple-200">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Cari"}
          </button>
        </form>

        <div className="space-y-4">
          {results?.map((o) => (
            <div key={o.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Invoice</p>
                  <p className="text-lg font-black text-gray-900">{o.order_display_id || o.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${o.status === 'selesai' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                  {o.status}
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-sm font-bold text-gray-700">{o.product_name}</p>
                <p className="text-xs text-gray-400 mt-1">Rp {o.product_price?.toLocaleString()}</p>
              </div>
            </div>
          ))}
          {!loading && results === null && <p className="text-center text-gray-400 text-sm">Pesanan tidak ditemukan.</p>}
        </div>
      </div>
    </div>
  );
}
