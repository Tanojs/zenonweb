"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { 
  ArrowLeft, 
  Search, 
  Loader2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  MessageSquare, 
  Copy,
  Check
} from "lucide-react";

// Mengambil kunci dari ENV Vercel secara aman dan profesional
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Order {
  id: string;
  created_at: string;
  product_name: string;
  product_type: string;
  product_price: number;
  payment_method: string;
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
      // Mencari di Supabase berdasarkan No WA ATAU ID Invoice
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .or(`customer_phone.eq.${searchKey.trim()},id.eq.${searchKey.trim()}`)
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case "proses":
        return (
          <span className="inline-flex items-center gap-1 bg-[#6C3CE1]/10 border border-[#6C3CE1]/20 text-[#6C3CE1] dark:text-purple-400 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
            <AlertCircle className="w-3 h-3" /> Proses
          </span>
        );
      case "selesai":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3" /> Selesai
          </span>
        );
      case "gagal":
        return (
          <span className="inline-flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 text-rose-500 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
            <XCircle className="w-3 h-3" /> Batal
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-6 sm:py-8 px-3 sm:px-4 lg:px-6 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-[#6C3CE1] mb-6 text-sm font-semibold transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-foreground">Riwayat Pesanan</h1>
          <p className="text-muted-foreground text-xs sm:text-sm font-medium mt-1">Cek status pengaktifan panel dan script Anda</p>
        </div>

        <form onSubmit={handleSearch} className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-sm mb-6 transition-colors duration-300">
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Masukkan No. WhatsApp / ID Invoice
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                placeholder="Contoh: 0857xxxxxx atau TP-xxxx"
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:border-[#6C3CE1] outline-none text-foreground transition-colors"
              />
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-[#6C3CE1] to-[#a855f7] hover:opacity-90 text-white font-bold text-xs px-5 rounded-xl transition-all active:scale-95 flex items-center gap-1.5 shadow-md shadow-[#6C3CE1]/10 disabled:opacity-50 cursor-pointer uppercase"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cari"}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {loading && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#6C3CE1] mx-auto mb-2" />
              <p className="text-xs text-muted-foreground font-semibold">Mencari data transaksi asli...</p>
            </div>
          )}

          {!loading && hasSearched && results === null && (
            <div className="bg-card border border-border rounded-2xl p-8 text-center transition-colors duration-300 shadow-sm">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-foreground uppercase">Data Tidak Ditemukan</h4>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1">
                Belum ada transaksi untuk nomor atau invoice tersebut di database.
              </p>
            </div>
          )}

          {!loading && results && results.map((order) => (
            <div key={order.id} className="bg-card border border-border rounded-2xl overflow-hidden transition-colors duration-300 shadow-sm">
              <div className="bg-muted/40 px-4 py-3 border-b border-border flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-foreground">{order.id}</span>
                  <button onClick={() => copyToClipboard(order.id)} className="text-muted-foreground hover:text-foreground p-1 cursor-pointer">
                    {copiedId === order.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <span className="text-[11px] text-muted-foreground font-medium">{formatDate(order.created_at)}</span>
              </div>

              <div className="p-4 sm:p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[9px] bg-[#6C3CE1]/10 text-[#6C3CE1] dark:text-purple-300 font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider">
                      {order.product_type}
                    </span>
                    <h3 className="text-base font-bold text-foreground mt-1.5">{order.product_name}</h3>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {order.panel_username && (
                  <div className="bg-background border border-border p-2.5 rounded-lg mb-4 text-xs font-mono text-muted-foreground">
                    Username Panel: {order.panel_username}
                  </div>
                )}

                <hr className="border-border my-3" />

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Pembayaran</p>
                    <p className="text-[#6C3CE1] dark:text-purple-400 text-lg font-black italic mt-0.5">{formatPrice(order.product_price)}</p>
                  </div>
                  
                  <Link
                    href={`https://wa.me/6285701961876?text=Halo Admin, saya mau bertanya status pesanan dengan Invoice *${order.id}*`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 bg-muted border border-border text-foreground hover:bg-foreground/5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#6C3CE1]" /> Komplain
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
