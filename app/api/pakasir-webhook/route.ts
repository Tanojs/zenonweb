import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 1. Log ini untuk memastikan data benar-benar masuk ke sistem
    console.log("=== WEBHOOK MASUK ===");
    console.log("Payload diterima:", JSON.stringify(data));

    const paymentStatus = data.status; 
    const customerPhone = data.customer_phone;
    const productName = data.product_name;

    // 2. Cek apakah Pakasir benar-benar mengirim status yang kita harapkan
    if (paymentStatus === "completed" || paymentStatus === "paid") {
      
      console.log(`Status terdeteksi: ${paymentStatus}. Mencoba kirim WA...`);

      const response = await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: {
          "Authorization": process.env.FONNTE_API_TOKEN || "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          target: customerPhone,
          message: `Halo! Pembayaran ${productName} sukses. Link: https://drive.google.com/file/d/link-file-kamu`,
        }),
      });

      const result = await response.json();
      console.log("Hasil kirim WA ke Fonnte:", result);

    } else {
      // Jika statusnya bukan 'paid'/'completed', kita akan tahu apa status yang dikirim
      console.log(`[INFO] Status transaksi bukan 'paid'/'completed', melainkan: ${paymentStatus}`);
    }

    return NextResponse.json({ success: true, received: true }, { status: 200 });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
