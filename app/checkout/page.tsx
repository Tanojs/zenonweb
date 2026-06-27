"use client";
import { useState } from "react";
import { QRCodeSVG } from 'qrcode.react'; // <--- Import ini

// ... (kode lainnya tetap)

function CheckoutContent() {
  const [qrString, setQrString] = useState<string>(""); // State baru
  const [loading, setLoading] = useState<boolean>(false);

  const handleActionBayar = async () => {
    // ... (validasi nama/wa tetap sama)
    setLoading(true);
    
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: product.price, quantity })
    });

    const res = await response.json();
    if (res.success) {
      setQrString(res.qrString); // Simpan string agar QR muncul
    } else {
      alert("Error: " + res.error);
    }
    setLoading(false);
  };

  // Tampilan jika QR sudah ada
  if (qrString) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="bg-card border p-6 rounded-2xl text-center shadow-xl">
          <h2 className="font-bold text-lg mb-4">Scan QRIS untuk Bayar</h2>
          <div className="bg-white p-2 inline-block rounded-lg">
             <QRCodeSVG value={qrString} size={250} />
          </div>
          <p className="text-xs text-muted-foreground mt-4">Tunjukkan kode ini ke aplikasi DANA/GOPAY/OVO Anda.</p>
          <button onClick={() => window.location.reload()} className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-xl text-xs font-bold">Selesai / Batal</button>
        </div>
      </div>
    );
  }

  // ... (tampilan form awal tetap sama seperti sebelumnya)
}
