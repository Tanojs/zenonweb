import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { price, quantity, whatsappNumber, product } = await request.json();

    const orderId = crypto.randomUUID();

    // 1. Masukkan ke Supabase
    const { error } = await supabase
      .from('orders')
      .insert([{ 
        id: orderId, 
        customer_name: "Guest", 
        customer_phone: whatsappNumber,
        product_name: product.name,
        product_type: product.type || "Default",
        product_price: price * quantity,
        status: 'pending' 
      }]);

    if (error) throw error;

    // 2. Minta QRIS ke Pakasir
    const res = await fetch("https://api.pakasir.com/v1/create-qr", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${process.env.PAKASIR_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        amount: price * quantity, 
        order_id: orderId 
      })
    });

    const pData = await res.json();

    // ⚠️ VALIDASI RESPONSE PAKASIR
    if (!pData.success || !pData.qr_string) {
      console.error("❌ Pakasir response error:", pData);
      throw new Error(pData.message || "Gagal membuat QRIS dari Pakasir");
    }

    return NextResponse.json({ 
      success: true, 
      qrString: pData.qr_string, 
      order_id: orderId 
    });

  } catch (err: any) {
    console.error("DEBUG ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}