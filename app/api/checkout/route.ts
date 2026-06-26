import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { productName, price, quantity, customerName, whatsappNumber } = await request.json();

    const apiKey = process.env.PAKASIR_API_KEY;
    const projectSlug = process.env.PAKASIR_PROJECT;
    const orderId = `TANO-${Date.now()}`;
    const totalAmount = price * quantity;

    // Perbaikan: Menambahkan Authorization Header sesuai dokumentasi C.2
    const response = await fetch("https://app.pakasir.com/api/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}` // Wajib ditambahkan
      },
      body: JSON.stringify({
        project: projectSlug,
        order_id: orderId,
        amount: totalAmount,
        customer_name: customerName,
        customer_phone: whatsappNumber,
        product_name: `${quantity}x ${productName}`,
      }),
    });

    const resData = await response.json();

    // Log untuk debugging jika masih error
    if (!response.ok) {
      console.log("Response Error dari Pakasir:", resData);
      return NextResponse.json({ 
        error: resData.message || "Gagal menghubungi server Pakasir" 
      }, { status: response.status });
    }

    return NextResponse.json({ 
      success: true, 
      paymentUrl: resData.payment_url || resData.url || resData.data?.payment_url 
    });

  } catch (error) {
    console.error("Error Checkout API:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server internal" }, { status: 500 });
  }
}
