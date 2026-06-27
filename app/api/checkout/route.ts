import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Menangkap data dari frontend
    const { price, quantity, whatsappNumber } = await request.json();
    const orderId = `TANO-${Date.now()}`;

    const response = await fetch("https://app.pakasir.com/api/transactioncreate/qris", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project: process.env.PAKASIR_PROJECT,
        order_id: orderId,
        amount: price * quantity,
        api_key: process.env.PAKASIR_API_KEY
      }),
    });

    const resData = await response.json();
    
    // Validasi respons API Pakasir (C.2)
    if (!response.ok || !resData.payment?.payment_number) {
      console.error("Pakasir API Error:", resData);
      return NextResponse.json({ error: "Gagal generate QR dari server" }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      qrString: resData.payment.payment_number 
    });

  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
