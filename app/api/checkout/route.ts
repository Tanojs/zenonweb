import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { productName, price, quantity, customerName, whatsappNumber } = await request.json();

    const apiKey = process.env.PAKASIR_API_KEY;
    const projectSlug = process.env.PAKASIR_PROJECT;
    const orderId = `TANO-${Date.now()}`; // Generate Order ID unik
    const totalAmount = price * quantity;

    // 🚀 Sesuai dengan Gambar Dokumentasi C.2: API Transaction Create
    const response = await fetch("https://app.pakasir.com/api/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project: projectSlug,
        api_key: apiKey,
        order_id: orderId,
        amount: totalAmount,
        customer_name: customerName,
        customer_phone: whatsappNumber,
        product_name: `${quantity}x ${productName}`,
      }),
    });

    const resData = await response.json();

    if (!response.ok) {
      return NextResponse.json({ 
        error: resData.message || "Gagal terhubung ke server Pakasir" 
      }, { status: 400 });
    }

    // Mengembalikan payment url invoice Pakasir ke frontend
    return NextResponse.json({ 
      success: true, 
      paymentUrl: resData.payment_url || resData.url || resData.data?.payment_url 
    });

  } catch (error) {
    console.error("Error Checkout API:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server internal" }, { status: 500 });
  }
}
