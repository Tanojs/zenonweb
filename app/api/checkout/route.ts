import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productName, price, quantity, customerName, whatsappNumber } = body;

    const apiKey = process.env.PAKASIR_API_KEY;
    const projectSlug = process.env.PAKASIR_PROJECT;
    const orderId = `TANO-${Date.now()}`;
    const totalAmount = price * quantity;

    console.log("DEBUG - Sending to Pakasir:", { projectSlug, orderId, totalAmount });

    const response = await fetch("https://app.pakasir.com/api/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
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
    
    // 🔥 INI BAGIAN PENTING: Kita kirim balik pesan error asli dari Pakasir ke browser
    if (!response.ok) {
      console.error("DEBUG - Pakasir Error Response:", resData);
      return NextResponse.json({ 
        error: `Pakasir Error (${response.status}): ${JSON.stringify(resData)}` 
      }, { status: response.status });
    }

    return NextResponse.json({ 
      success: true, 
      paymentUrl: resData.payment_url || resData.url 
    });

  } catch (error) {
    return NextResponse.json({ error: "Server Error: " + error }, { status: 500 });
  }
}
