"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// 1. Komponen yang berisi logika halaman
function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [status, setStatus] = useState("Memeriksa pembayaran...");

  useEffect(() => {
    if (orderId) {
      // Logika cek status pembayaran ke API
      fetch(`/api/check-payment?order_id=${orderId}`)
        .then(res => res.json())
        .then(data => {
          setStatus(data.status === "paid" ? "success" : "pending");
        });
    }
  }, [orderId]);

  return (
    <div className="p-8 text-center">
      {status === "success" ? (
        <div className="bg-green-100 p-6 rounded-2xl">
          <h1 className="text-2xl font-bold text-green-700">Pembayaran Berhasil!</h1>
          <p className="mt-4">Ini detail akun/file Anda:</p>
          <div className="mt-4 bg-white p-4 rounded-xl border font-mono">
            Username: akun_pro_123 <br/>
            Password: rahasia_banget
          </div>
        </div>
      ) : (
        <p>Sedang memproses pembayaran... harap tunggu.</p>
      )}
    </div>
  );
}

// 2. Bungkus dengan Suspense agar tidak error saat build
export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
