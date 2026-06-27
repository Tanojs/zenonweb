import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    console.log("=== WEBHOOK MASUK FROM PAKASIR ===");
    console.log(data);

    // Sesuaikan status dengan dokumentasi Pakasir (biasanya 'completed' atau 'paid')
    // Cek di log console Vercel kamu, pastikan statusnya apa saat bayar sukses
    const paymentStatus = data.status; 

    if (paymentStatus === "completed" || paymentStatus === "paid") {
      
      const customerPhone = data.customer_phone; // Pastikan data ini terkirim dari Pakasir
      const productName = data.product_name;

      // --- LOGIKA PENGIRIMAN PRODUK ---
      // Kamu bisa menggunakan API WhatsApp pihak ke-3 (contoh: Fonnte, RuangWA, dll)
      await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: {
          "Authorization": process.env.FONNTE_API_TOKEN || "", // Masukkan API Token WA-mu di Vercel env
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          target: customerPhone,
          message: `Halo! Pembayaran ${productName} sukses.\n\nIni adalah file/lisensi Anda: [LINK_FILE_KAMU_DISINI]`,
        }),
      });

      console.log(`[SUKSES] Produk telah dikirim ke ${customerPhone}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
