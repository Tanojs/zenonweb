"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function CekOrderPage() {
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Kita coba cari di 3 kolom sekaligus dengan cara terpisah
    const key = searchKey.trim();
    
    // 1. Cari berdasarkan Display ID
    const { data: data1 } = await supabase.from("orders").select("*").eq("order_display_id", key);
    // 2. Cari berdasarkan UUID
    const { data: data2 } = await supabase.from("orders").select("*").eq("id", key);
    // 3. Cari berdasarkan WA
    const { data: data3 } = await supabase.from("orders").select("*").eq("customer_phone", key);
    
    const combined = [...(data1||[]), ...(data2||[]), ...(data3||[])];
    // Ambil yang unik saja
    const unique = combined.filter((v,i,a) => a.findIndex(t => t.id === v.id) === i);
    
    setResults(unique.length > 0 ? unique : null);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input className="border p-2 w-full" onChange={(e) => setSearchKey(e.target.value)} placeholder="Cari ORD-xxxx atau No WA..." />
        <button type="submit" className="bg-purple-600 text-white px-4">Cari</button>
      </form>
      
      <div className="mt-6">
        {loading ? <p>Mencari...</p> : results?.map(o => (
          <div key={o.id} className="border p-4 mb-2 rounded-lg">
            <p className="font-bold">{o.order_display_id || o.id}</p>
            <p>{o.product_name} - {o.status}</p>
          </div>
        )) || <p>Tidak ditemukan.</p>}
      </div>
    </div>
  );
}
