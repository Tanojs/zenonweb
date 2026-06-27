import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { quantity, whatsappNumber, customerName, product } = await request.json();

    if (!whatsappNumber || !customerName) {
      return NextResponse.json({ error: "Nama dan WhatsApp wajib diisi" }, { status: 400 });
    }

    // 1. CEK STOK DAN DATA PRODUK
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('stock, name, price, delivery_info')
      .eq('id', product.id)
      .single();

    if (productError || !productData) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    if (productData.stock < quantity) {
      return NextResponse.json({ error: "Stok tidak cukup" }, { status: 400 });
    }

    const totalAmount = productData.price * quantity;
    const orderId = crypto.randomUUID();

    // 2. INSERT ORDER (Menyertakan product_type dan account_data dari delivery_info)
    const { error: insertError } = await supabase
      .from('orders')
      .insert([{ 
        id: orderId,
        customer_name: customerName,
        customer_phone: whatsappNumber,
        product_id: product.id,
        product_name: productData.name,
        product_type: product.type,
        product_price: totalAmount,
        quantity: quantity,
        status: 'pending',
        account_data: productData.delivery_info // Data otomatis masuk ke sini
      }]);

    if (insertError) {
      console.error("Gagal insert:", insertError);
      throw new Error("Gagal menyimpan order");
    }

    // 3. MINTA QRIS KE PAKASIR
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

    if (!pData.payment || !pData.payment.payment_number) {
      throw new Error("Gagal membuat QRIS");
    }

    return NextResponse.json({ 
      success: true,
      qrString: pData.payment.payment_number,
      order_id: orderId
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
