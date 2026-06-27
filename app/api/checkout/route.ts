import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(request: Request) {
  const { price, quantity, whatsappNumber } = await request.json();

  // 1. Simpan dulu ke Supabase agar punya ID
  const { data: order, error } = await supabase
    .from('orders')
    .insert([{ 
      status: 'pending', 
      price: price * quantity,
      whatsapp: whatsappNumber 
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Gagal simpan ke DB" }, { status: 500 });

  // 2. Minta QRIS ke Pakasir (gunakan order.id dari Supabase sebagai referensi)
  const res = await fetch("https://api.pakasir.com/v1/create-qr", {
    method: "POST",
    headers: { "Authorization": "Bearer TOKEN_PAKASIR_KAMU" },
    body: JSON.stringify({ 
      amount: price * quantity, 
      order_id: order.id 
    })
  });

  const pData = await res.json();
  return NextResponse.json({ success: true, qrString: pData.qr_string, order_id: order.id });
}
