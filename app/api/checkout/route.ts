import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { quantity, whatsappNumber, customerName, product, price } = await request.json();

    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('stock, name, price, delivery_info')
      .eq('id', product.id)
      .single();

    if (productError || !productData || productData.stock < quantity) {
      return NextResponse.json({ error: "Produk tidak tersedia/Stok habis" }, { status: 400 });
    }

    const totalAmount = productData.price * quantity;
    const orderId = crypto.randomUUID();

    const { data: orderData, error: insertError } = await supabase
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
        account_data: productData.delivery_info
      }])
      .select('order_display_id')
      .single();

    if (insertError) throw new Error("Gagal simpan order");

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
    if (!pData.payment?.payment_number) throw new Error("Gagal membuat QRIS");

    return NextResponse.json({ 
      success: true, 
      qrString: pData.payment.payment_number, 
      order_id: orderId,
      display_id: orderData?.order_display_id 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
