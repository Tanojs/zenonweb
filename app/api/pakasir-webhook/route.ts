import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

// Pastikan nama environment variable di Vercel sesuai dengan ini
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! 
);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Mengecek apakah pembayaran sukses
    if (data.status === "paid" || data.status === "completed") {
      // Mengubah status di tabel orders
      const { error } = await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', data.order_id); 

      if (error) throw error;
      console.log("Status order berhasil diupdate ke paid");
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}
