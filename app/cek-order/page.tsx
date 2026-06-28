"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Search, Loader2, Package, CheckCircle2, Clock } from "lucide-react";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function CekOrderPage() {
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    
    const key = searchKey.trim();
    const { data: data1 } = await supabase.from("orders").select("*").eq("order_display_id", key);
    const { data: data2 } = await supabase.from("orders").select("*").eq("id", key);
    const { data: data3 } = await supabase.from("orders").select("*").eq("customer_phone", key);
    
    const combined = [...(data1||[]), ...(data2||[]), ...(data3||[])];
    const unique = combined.filter((v,i,a) => a.findIndex(t => t.id === v.id) === i);
    
    setResults(unique.length > 0 ? unique : null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Lacak Pesanan</h2>
        
        <form onSubmit={handleSearch} className="relative mb-8">
          <input 
            className="w-full p-4 pl-12 rounded-2xl border border-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
            onChange={(e) => setSearchKey(e.target.value)} 
            placeholder="Ketik ORD-xxxx atau No. WA..." 
          />
          <Search className="absolute left-4 top-4 text-gray-400" size={20} />
          <button type="submit" className="w-full mt-3 bg-purple-600 text-white py-3 rounded-2xl font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Cek Status"}
          </button>
        </form>
        
        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-gray-500">Mencari data...</p>
          ) : results ? results.map(o => (
            <div key={o.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Invoice</p>
                    <p className="font-black text-gray-800">{o.order_display_id || o.id}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${o.status === 'selesai' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {o.status === 'selesai' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {o.status}
                </div>
              </div>
              <p className="font-bold text-gray-700">{o.product_name}</p>
              <p className="text-sm text-gray-500">Total: Rp {o.product_price?.toLocaleString()}</p>
            </div>
          )) : searched && <p className="text-center text-gray-400">Data tidak ditemukan.</p>}
        </div>
      </div>
    </div>
  );
}
