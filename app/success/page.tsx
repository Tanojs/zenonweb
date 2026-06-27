"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [status, setStatus] = useState("Memeriksa pembayaran...");

  useEffect(() => {
    // Cek ke API internal kita apakah pembayaran sudah masuk
    fetch(`/api/check-payment?order_id=${orderId}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "paid") {
          setStatus("success");
        } else {
          setStatus("pending");
        }
      });
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
