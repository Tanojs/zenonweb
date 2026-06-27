import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

// ⚠️ PAKAI SERVICE ROLE KEY agar bisa UPDATE walau RLS aktif
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log("📩 Webhook received:", JSON.stringify(payload, null, 2));

    // ⚠️ Status dari Pakasir = "completed" (bukan "paid")
    if (payload.status === "completed") {
      // Validasi tambahan: cocokkan project dan amount (opsional tapi disarankan)
      if (payload.project !== process.env.PAKASIR_PROJECT) {
        console.warn("⚠️ Project mismatch, diabaikan");
        return NextResponse.json({ success: false, error: "Project mismatch" }, { status: 400 });
      }

      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'paid',
          account_data: payload // simpan seluruh payload webhook
        })
        .eq('id', payload.order_id);

      if (error) throw error;
      console.log(`✅ Order ${payload.order_id} updated to paid`);
    } else {
      console.log("⏩ Status bukan completed, diabaikan");
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}