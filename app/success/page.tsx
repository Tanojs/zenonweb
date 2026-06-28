"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      supabase.from('orders').select('order_display_id, account_data').eq('id', orderId).single()
        .then(({ data }) => setOrder(data));
    }
  }, [orderId]);

  if (!order) return <div className="p-10 text-center">Memuat data...</div>;

  return (
    <div className="max-w-sm mx-auto bg-white rounded-3xl shadow-lg p-8 mt-10 text-center">
      <h1 className="text-2xl font-bold text-green-600">Berhasil!</h1>
      <p className="mt-4 text-gray-500">Nomor Pesanan:</p>
      <div className="text-3xl font-black text-purple-700 my-2">{order.order_display_id}</div>
      <div className="mt-6 p-4 bg-gray-50 rounded-xl break-all">
        {order.account_data || "Menunggu pengiriman..."}
      </div>
    </div>
  );
}

export default function Page() { return <Suspense fallback={<div>Loading...</div>}><SuccessContent /></Suspense>; }
