import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { productName, price, quantity, customerName, whatsappNumber } = await request.json();

    const apiKey = process.env.PAKASIR_API_KEY;
    const projectSlug = process.env.PAKASIR_PROJECT; // Pastikan ini bernilai "tano-pedia"
    const orderId = `TANO-${Date.now()}`;
    const totalAmount = price * quantity;

    // URL endpoint disesuaikan dengan format: /api/v1/project/{slug}/payment
    const url = `https://app.pakasir.com/api/v1/project/${projectSlug}/payment`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        order_id: orderId,
        amount: totalAmount,
        customer_name: customerName,
        customer_phone: whatsappNumber,
        product_name: `${quantity}x ${productName}`,
      }),
    });

    const resData = await response.json();

    if (!response.ok) {
      console.error("DEBUG - Pakasir Error Response:", resData);
      return NextResponse.json({ 
        error: `Pakasir Error (${response.status}): ${JSON.stringify(resData)}` 
      }, { status: response.status });
    }

    // Mengembalikan payment url invoice Pakasir
    return NextResponse.json({ 
      success: true, 
      paymentUrl: resData.payment_url || resData.url || resData.data?.payment_url 
    });

  } catch (error) {
    console.error("Error Checkout API:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server internal" }, { status: 500 });
  }
}
