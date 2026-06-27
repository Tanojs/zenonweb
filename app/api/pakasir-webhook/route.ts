import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log("📩 Webhook received:", JSON.stringify(payload, null, 2));

    if (payload.status === "completed") {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', payload.order_id);

      if (error) {
        console.error("❌ Supabase update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log(`✅ Order ${payload.order_id} updated to paid`);
    } else {
      console.log("⏩ Status bukan completed, diabaikan");
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}