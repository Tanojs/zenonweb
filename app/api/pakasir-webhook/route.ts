import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.SUPABASE_ANON_KEY! // Pastikan nama variabel di Vercel sesuai
);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Pakasir biasanya mengirim order_id yang sama dengan id di tabel orders
    if (data.status === "paid" || data.status === "completed") {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', data.order_id); // Sesuaikan dengan kolom ID di tabel orders kamu

      if (error) console.error("Gagal update Supabase:", error);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}
