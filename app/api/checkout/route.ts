import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { price, quantity, whatsappNumber, customerName, product } = await request.json();

    // Validasi input
    if (!whatsappNumber) {
      return NextResponse.json({ error: "Nomor WhatsApp wajib diisi" }, { status: 400 });
    }
    if (!product || !product.id) {
      return NextResponse.json({ error: "Produk tidak valid" }, { status: 400 });
    }
    if (quantity < 1) {
      return NextResponse.json({ error: "Minimal beli 1" }, { status: 400 });
    }

    // 1. CEK STOK PRODUK
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('stock, name, price')
      .eq('id', product.id)
      .single();

    if (productError || !productData) {
      console.error("Produk tidak ditemukan:", productError);
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    if (productData.stock < quantity) {
      return NextResponse.json({ 
        error: `Stok tidak cukup. Sisa: ${productData.stock}` 
      }, { status: 400 });
    }

    const totalAmount = productData.price * quantity;
    const orderId = crypto.randomUUID();

    // 2. INSERT ORDER
    const { error: insertError } = await supabase
      .from('orders')
      .insert([{ 
        id: orderId,
        customer_name: customerName || "Guest",
        customer_phone: whatsappNumber,
        product_name: productData.name,
        product_type: product.type || "Default",
        product_price: totalAmount,
        product_id: product.id,
        quantity: quantity,
        status: 'pending'
      }]);

    if (insertError) {
      console.error("Gagal insert order:", insertError);
      throw new Error("Gagal menyimpan order");
    }

    console.log(`Order ${orderId} dibuat, stok sebelum: ${productData.stock}`);

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
      console.error("Pakasir error:", pData);
      await supabase.from('orders').delete().eq('id', orderId);
      throw new Error(pData.message || "Gagal membuat QRIS");
    }

    console.log(`QRIS berhasil untuk order ${orderId}`);

    return NextResponse.json({ 
      success: true,
      qrString: pData.payment.payment_number,
      order_id: orderId,
      total_payment: pData.payment.total_payment || totalAmount,
      expired_at: pData.payment.expired_at
    });

  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json({ 
      error: err.message || "Terjadi kesalahan internal" 
    }, { status: 500 });
  }
}