"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { 
  ArrowLeft, Search, Loader2, Clock, CheckCircle2, 
  AlertCircle, XCircle, MessageSquare, Copy, Check 
} from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Order {
  id: string;
  order_display_id?: string;
  created_at: string;
  product_name: string;
  product_type: string;
  product_price: number;
  status: "pending" | "proses" | "selesai" | "gagal";
  panel_username?: string;
}

export default function CekOrderPage() {
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Order[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchKey.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .or(`customer_phone.eq.${searchKey.trim()},id.eq.${searchKey.trim()},order_display_id.eq.${searchKey.trim()}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResults(data && data.length > 0 ? data : null);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
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
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-[#6C3CE1] mb-6 text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black uppercase italic tracking-tight">Riwayat Pesanan</h1>
        </div>

        <form onSubmit={handleSearch} className="bg-card border rounded-2xl p-5 shadow-sm mb-6">
          <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">
            Masukkan No. WA atau Invoice (Contoh: ORD-1234)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="0857... atau ORD-..."
              className="flex-1 bg-background border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#6C3CE1]"
            />
            <button type="submit" className="bg-[#6C3CE1] text-white font-bold px-6 rounded-xl">
              {loading ? <Loader2 className="animate-spin" /> : "Cari"}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {results?.map((order) => (
            <div key={order.id} className="bg-card border rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-[#6C3CE1]">
                    {order.order_display_id || order.id}
                  </span>
                  <button onClick={() => copyToClipboard(order.order_display_id || order.id)} className="text-muted-foreground hover:text-foreground">
                    {copiedId ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <span className="text-[10px] font-bold uppercase border px-2 py-1 rounded-lg">{order.status}</span>
              </div>
              <h3 className="text-lg font-bold">{order.product_name}</h3>
              <p className="text-sm text-muted-foreground mt-2">Harga: Rp {order.product_price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
