import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log("Webhook received:", JSON.stringify(payload, null, 2));

    if (payload.status !== "completed") {
      console.log("Status bukan completed, diabaikan");
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // 1. UPDATE STATUS ORDER
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('id', payload.order_id);

    if (updateError) {
      console.error("Gagal update status:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    console.log(`Order ${payload.order_id} updated to paid`);

    // 2. AMBIL product_id DAN quantity DARI ORDER
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('product_id, quantity')
      .eq('id', payload.order_id)
      .single();

    if (orderError || !orderData) {
      console.error("Gagal ambil data order:", orderError);
      return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
    }

    // 3. KURANGI STOK PRODUK
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('stock')
      .eq('id', orderData.product_id)
      .single();

    if (productError || !productData) {
      console.error("Produk tidak ditemukan:", productError);
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    const newStock = Math.max(0, productData.stock - orderData.quantity);

    const { error: stockError } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', orderData.product_id);

    if (stockError) {
      console.error("Gagal update stok:", stockError);
      return NextResponse.json({ error: stockError.message }, { status: 500 });
    }

    console.log(`Stok produk ${orderData.product_id} updated: ${productData.stock} -> ${newStock}`);

    // 4. SIMPAN DELIVERY_INFO KE ACCOUNT_DATA
    const { data: productInfo } = await supabase
      .from('products')
      .select('delivery_info')
      .eq('id', orderData.product_id)
      .single();

    if (productInfo?.delivery_info) {
      await supabase
        .from('orders')
        .update({ account_data: productInfo.delivery_info })
        .eq('id', payload.order_id);
      
      console.log(`Delivery info saved for order ${payload.order_id}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}