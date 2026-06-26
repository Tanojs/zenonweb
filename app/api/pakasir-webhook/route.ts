import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Membaca data JSON otomatis yang dikirim oleh Pakasir
    const data = await request.json();
    
    // Tampilkan di terminal console backend untuk memantau proses tracking
    console.log("=== WEBHOOK MASUK FROM PAKASIR ===");
    console.log(data);

    const orderId = data.order_id;
    const paymentStatus = data.status; // Berisi 'paid', 'pending', dll.
    const amountPaid = data.amount;

    // 2. Validasi status pembayaran berdasarkan dokumentasi Pakasir ('paid')
    if (paymentStatus === "paid") {
      console.log(`[SUKSES] Pesanan dengan ID ${orderId} senilai Rp ${amountPaid.toLocaleString()} TELAH LUNAS.`);

      // -----------------------------------------------------------------
      // TEMPAT MENARUH LOGIKA OTOMATISASI PRODUK KAMU:
      // - Kirim produk script / lisensi app secara otomatis lewat bot WA.
      // - Update status transaksi di database (jika ada).
      // -----------------------------------------------------------------
      
    } else {
      console.log(`[INFO] Pesanan ${orderId} menerima update status: ${paymentStatus}`);
    }

    // 3. Memberikan respon balik ke Pakasir sebagai tanda data telah diterima dengan baik
    return NextResponse.json({ success: true, message: "Webhook processed" }, { status: 200 });

  } catch (error) {
    console.error("Webhook Internal Server Error:", error);
    return NextResponse.json({ error: "Invalid payload or server error" }, { status: 500 });
  }
}
