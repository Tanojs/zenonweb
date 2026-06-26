import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { productName, price, quantity, customerName, whatsappNumber } = await request.json();

    const apiKey = process.env.PAKASIR_API_KEY;
    const projectSlug = process.env.PAKASIR_PROJECT;
    const orderId = `TANO-${Date.now()}`;
    const totalAmount = price * quantity;

    // Tentukan metode pembayaran, misal: qris
    const method = "qris";

    const response = await fetch(
      `https://app.pakasir.com/api/transactioncreate/${method}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project: projectSlug,
          order_id: orderId,
          amount: totalAmount,
          api_key: apiKey, // API Key dikirim di body, BUKAN di header
        }),
      }
    );

    const resData = await response.json();

    if (!response.ok) {
      console.error("DEBUG - Pakasir Error:", resData);
      return NextResponse.json(
        {
          error: `Pakasir Error (${response.status}): ${JSON.stringify(resData)}`,
        },
        { status: response.status }
      );
    }

    // Response dari Pakasir biasanya mengembalikan payment_number (QR string) atau virtual account
    // Tidak ada payment_url, karena ini API untuk menampilkan QR/VA di halamanmu sendiri
    return NextResponse.json({
      success: true,
      data: resData,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}