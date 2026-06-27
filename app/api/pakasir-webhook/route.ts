import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

// ⚠️ PAKAI SERVICE ROLE KEY (bukan ANON)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log("📩 Webhook received:", JSON.stringify(payload, null, 2));

    // Cek status (sesuai dokumen Pakasir)
    const isPaid = payload.status === "paid" || payload.status === "completed";

    if (isPaid) {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', payload.order_id);

      if (error) throw error;
      console.log(`✅ Order ${payload.order_id} updated to paid`);
    } else {
      console.log("⏩ Status bukan paid, diabaikan");
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}