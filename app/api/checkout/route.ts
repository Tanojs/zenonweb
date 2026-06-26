import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { productName, price, quantity, customerName, whatsappNumber } = await request.json();

    const apiKey = process.env.PAKASIR_API_KEY;
    const projectSlug = process.env.PAKASIR_PROJECT; 
    const orderId = `TANO-${Date.now()}`;
    const totalAmount = price * quantity;

    // KITA BALIK KE ENDPOINT STANDAR DOKUMENTASI (C.2)
    // Tanpa menyisipkan slug di dalam URL
    const response = await fetch("https://app.pakasir.com/api/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        project: projectSlug, // Slug dikirim di sini sesuai standar banyak API
        order_id: orderId,
        amount: totalAmount,
        customer_name: customerName,
        customer_phone: whatsappNumber,
        product_name: `${quantity}x ${productName}`,
      }),
    });

    const resData = await response.json();

    if (!response.ok) {
      console.error("DEBUG - Pakasir Error:", resData);
      return NextResponse.json({ 
        error: `Pakasir Error (${response.status}): ${JSON.stringify(resData)}` 
      }, { status: response.status });
    }

    return NextResponse.json({ 
      success: true, 
      paymentUrl: resData.payment_url || resData.url || resData.data?.payment_url 
    });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
