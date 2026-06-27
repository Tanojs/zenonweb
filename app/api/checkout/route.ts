import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { price, quantity, whatsappNumber, product } = await request.json();

    // Menggunakan crypto.randomUUID() untuk membuat ID unik secara otomatis
    const orderId = crypto.randomUUID();

    const { error } = await supabase
      .from('orders')
      .insert([{ 
        id: orderId, // Wajib diisi karena id adalah Primary Key
        customer_name: "Guest", 
        customer_phone: whatsappNumber,
        product_name: product.name,
        product_type: product.type || "Default",
        product_price: price * quantity,
        status: 'pending' 
      }]);

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Lanjut ke API Pakasir
    // ... sisa kode tetap sama
    return NextResponse.json({ success: true, order_id: orderId });

  } catch (err) {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
