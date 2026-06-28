"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, Search, Loader2, Copy, Check } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

    try {
      // Mencari di 3 kolom sekaligus
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .or(`customer_phone.eq.${key},id.eq.${key},order_display_id.eq.${key}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResults(data && data.length > 0 ? data : null);
    } catch (err) {
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground mb-6 text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>

        <h1 className="text-2xl font-black mb-6 text-center">Riwayat Pesanan</h1>

        <form onSubmit={handleSearch} className="bg-card border rounded-2xl p-4 shadow-sm mb-6 flex gap-2">
          <input
            type="text"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            placeholder="Ketik ORD-xxxx atau No. WA..."
            className="flex-1 bg-background border rounded-xl px-4 py-3 text-sm outline-none"
          />
          <button type="submit" className="bg-[#6C3CE1] text-white px-6 rounded-xl font-bold">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Cari"}
          </button>
        </form>

        <div className="space-y-4">
          {results?.map((order) => (
            <div key={order.id} className="bg-card border rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-[#6C3CE1]">
                    {order.order_display_id || order.id}
                  </span>
                  <button onClick={() => copyToClipboard(order.order_display_id || order.id)} className="text-muted-foreground">
                    {copiedId === (order.order_display_id || order.id) ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <span className="text-[10px] font-bold uppercase border px-2 py-1 rounded-lg">{order.status}</span>
              </div>
              <h3 className="text-md font-bold">{order.product_name}</h3>
              <p className="text-xs text-muted-foreground mt-1">Total: Rp {order.product_price?.toLocaleString()}</p>
            </div>
          ))}
          {!loading && results === null && <p className="text-center text-muted-foreground">Tidak ditemukan.</p>}
        </div>
      </div>
    </div>
  );
}
