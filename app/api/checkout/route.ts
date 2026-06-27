import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { price, quantity, whatsappNumber, product } = await request.json();

    // Validasi input
    if (!whatsappNumber) {
      return NextResponse.json({ error: "Nomor WhatsApp wajib diisi" }, { status: 400 });
    }
    if (!product || !product.id) {
      return NextResponse.json({ error: "Produk tidak valid" }, { status: 400 });
    }
    if (quantity < 1) {
      return NextResponse.json({ error: "Quantity minimal 1" }, { status: 400 });
    }

    // 1. CEK STOK PRODUK
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('stock, name, price')
      .eq('id', product.id)
      .single();

    if (productError || !productData) {
      console.error("❌ Produk tidak ditemukan:", productError);
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    // Cek apakah stok mencukupi
    if (productData.stock < quantity) {
      return NextResponse.json({ 
        error: `Stok tidak mencukupi. Sisa stok: ${productData.stock}` 
      }, { status: 400 });
    }

    // Hitung total harga (pakai harga dari database, bukan dari frontend)
    const totalAmount = productData.price * quantity;
    const orderId = crypto.randomUUID();

    // 2. INSERT ORDER KE SUPABASE (status pending)
    const { error: insertError } = await supabase
      .from('orders')
      .insert([{ 
        id: orderId, 
        customer_name: "Guest", 
        customer_phone: whatsappNumber,
        product_name: productData.name,
        product_type: product.type || "Default",
        product_price: totalAmount,
        product_id: product.id, // ← PENTING: simpan product_id untuk kurangi stok nanti
        quantity: quantity,     // ← PENTING: simpan quantity
        status: 'pending' 
      }]);

    if (insertError) {
      console.error("❌ Gagal insert order:", insertError);
      throw new Error("Gagal menyimpan order");
    }

    console.log(`✅ Order ${orderId} created, stock sebelum: ${productData.stock}`);

    // 3. MINTA QRIS KE PAKASIR (sesuai dokumentasi terbaru)
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

    // Validasi response Pakasir
    if (!pData.payment || !pData.payment.payment_number) {
      console.error("❌ Pakasir error response:", pData);
      
      // Kalau gagal, hapus order dari database (biar ga jadi sampah)
      await supabase.from('orders').delete().eq('id', orderId);
      
      throw new Error(pData.message || "Gagal membuat QRIS dari Pakasir");
    }

    console.log(`✅ QRIS generated for order ${orderId}`);

    // 4. KEMBALIKAN RESPONSE KE FRONTEND
    return NextResponse.json({ 
      success: true, 
      qrString: pData.payment.payment_number, // ← QR string dari Pakasir
      order_id: orderId,
      total_payment: pData.payment.total_payment || totalAmount,
      expired_at: pData.payment.expired_at
    });

  } catch (err: any) {
    console.error("❌ Checkout error:", err);
    return NextResponse.json({ 
      error: err.message || "Terjadi kesalahan internal" 
    }, { status: 500 });
  }
}