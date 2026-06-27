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
    async function fetchOrder() {
      if (!orderId) return;
      
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (data) setOrder(data);
    }
    fetchOrder();
  }, [orderId]);

  return (
    <div className="p-8 text-center">
      {order?.status === 'paid' ? (
        <div className="bg-green-100 p-6 rounded-2xl">
          <h1 className="text-2xl font-bold text-green-700">Pembayaran Berhasil!</h1>
          <p className="mt-4">Ini detail akun Anda:</p>
          <div className="mt-4 bg-white p-4 rounded-xl border font-mono">
            {/* Pastikan kamu sudah punya kolom 'account_data' di tabel orders */}
            {order.account_data || "Data belum tersedia"}
          </div>
        </div>
      ) : (
        <p>Sedang memproses pembayaran... silakan tunggu atau refresh halaman.</p>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return <Suspense fallback={<div>Loading...</div>}><SuccessContent /></Suspense>;
}
