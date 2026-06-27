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

    // 2. Minta QRIS ke Pakasir (sesuai dokumen)
    const totalAmount = price * quantity;
    const res = await fetch("https://app.pakasir.com/api/transactioncreate/qris", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project: process.env.PAKASIR_PROJECT,
        order_id: orderId,
        amount: totalAmount,
        api_key: process.env.PAKASIR_API_KEY
      })
    });

    const pData = await res.json();

    // Validasi response
    if (!pData.payment || !pData.payment.payment_number) {
      console.error("❌ Pakasir error response:", pData);
      throw new Error(pData.message || "Gagal membuat QRIS");
    }

    return NextResponse.json({ 
      success: true, 
      qrString: pData.payment.payment_number, // ← ini QR string-nya
      order_id: orderId 
    });

  } catch (err: any) {
    console.error("DEBUG ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}