import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { price, quantity } = await request.json();
    const orderId = `TANO-${Date.now()}`;

    const response = await fetch("https://app.pakasir.com/api/transactioncreate/qris", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project: process.env.PAKASIR_PROJECT, // pastikan di Vercel env isinya: tano-pedia
        order_id: orderId,
        amount: price * quantity,
        api_key: process.env.PAKASIR_API_KEY
      }),
    });

    const resData = await response.json();
    if (!response.ok) throw new Error("Gagal generate QR");

    return NextResponse.json({ 
      success: true, 
      qrString: resData.payment.payment_number // Ini adalah string untuk QR
    });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memproses pembayaran" }, { status: 500 });
  }
}
