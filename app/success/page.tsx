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
      supabase.from('orders').select('*').eq('id', orderId).single().then(({data}) => setOrder(data));
    }
  }, [orderId]);

  if (!order) return <div className="p-10 text-center">Memuat data pesanan...</div>;

  return (
    <div className="p-10 text-center max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-green-600">Pembayaran Berhasil!</h1>
      <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-dashed">
        <p className="font-bold text-sm text-gray-500 uppercase">Data Pesanan Anda:</p>
        <div className="mt-4 break-all bg-white p-4 rounded shadow-inner font-mono text-sm">
          {order.account_data || "Menunggu pengiriman admin..."}
        </div>
      </div>
    </div>
  );
}

export default function Page() { return <Suspense fallback={<div>Loading...</div>}><SuccessContent /></Suspense>; }
