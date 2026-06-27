import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    console.log("=== WEBHOOK MASUK FROM PAKASIR ===");
    console.log(data);

    const paymentStatus = data.status; 

    if (paymentStatus === "completed" || paymentStatus === "paid") {
      const customerPhone = data.customer_phone;
      const productName = data.product_name;

      // LOGIKA PENGIRIMAN PRODUK VIA API WHATSAPP
      // Ganti link di bawah dengan link file asli milikmu
      const fileLink = "https://drive.google.com/file/d/link-file-kamu";

      await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: {
          "Authorization": process.env.FONNTE_API_TOKEN || "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          target: customerPhone,
          message: `Halo! Pembayaran ${productName} sukses. Ini adalah file/lisensi Anda: ${fileLink}`,
        }),
      });

      console.log(`[SUKSES] Produk telah dikirim ke ${customerPhone}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
