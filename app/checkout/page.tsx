"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2"; // Import SweetAlert2
import withReactContent from "sweetalert2-react-content";
import { 
  ArrowLeft, 
  Loader2,
  UserCircle,
  X,
  Download
} from "lucide-react";

const MySwal = withReactContent(Swal);
const WHATSAPP_NUMBER = "6285701961876";
const QRIS_IMAGE_URL = "/images/qristano.png"; 

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [showQrisModal, setShowQrisModal] = useState(false);
  
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [panelUsername, setPanelUsername] = useState(""); 

  const productType = searchParams.get("type") || "panel";
  const productName = searchParams.get("name") || "";
  const productPrice = parseInt(searchParams.get("price") || "0");

  const handleDownloadQris = () => {
    const link = document.createElement("a");
    link.href = QRIS_IMAGE_URL;
    link.download = "QRIS-ZenonStore.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShowQris = () => {
    // Validasi menggunakan SweetAlert2
    if (!customerName || !customerPhone) {
      MySwal.fire({
        title: <span className="text-white">Waduh!</span>,
        html: <span className="text-zinc-400 text-sm">Mohon lengkapi Nama dan No. WhatsApp dulu ya cik!</span>,
        icon: "warning",
        background: "#18181b", // bg-zinc-900
        confirmButtonColor: "#14b8a6", // teal-500
        confirmButtonText: "Oke Siap",
      });
      return;
    }
    
    if (productType === "panel" && !panelUsername) {
      MySwal.fire({
        title: <span className="text-white">Username Kosong</span>,
        html: <span className="text-zinc-400 text-sm">Mohon isi Username untuk akun Panel Anda!</span>,
        icon: "info",
        background: "#18181b",
        confirmButtonColor: "#14b8a6",
        confirmButtonText: "Sip!",
      });
      return;
    }
    setShowQrisModal(true);
  };

  const handleConfirmWhatsApp = () => {
    let categoryLabel = "Produk";
    if (productType === "panel") categoryLabel = "Panel";
    else if (productType === "script") categoryLabel = "Script";
    else if (productType === "app") categoryLabel = "Aplikasi";

    const message = `Halo Admin ZenonStore,%0A%0A` +
                    `*KONFIRMASI PEMBAYARAN QRIS*%0A` +
                    `----------------------------%0A` +
                    `- Pesanan: *${categoryLabel} - ${productName}*%0A` +
                    `- Total: *${formatPrice(productPrice)}*%0A%0A` +
                    `*Data Pembeli:*%0A` +
                    `- Nama: ${customerName}%0A` +
                    `- No. WA: ${customerPhone}%0A` +
                    (productType === "panel" ? `- USN Panel: *${panelUsername}*%0A` : "") +
                    `----------------------------%0A` +
                    `Saya sudah scan QRIS, berikut saya lampirkan bukti transfernya.`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-6 sm:py-8 px-3 sm:px-4 lg:px-6 text-zinc-100 font-sans">
      <div className="max-w-2xl mx-auto">
        <Link href="/#products" className="inline-flex items-center gap-2 text-zinc-400 hover:text-teal-400 mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Produk
        </Link>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">Checkout</h1>
          <p className="text-zinc-400 text-sm">Lengkapi data & scan QRIS</p>
        </div>

        {/* Card Ringkasan Produk */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white font-semibold">{productType === "panel" ? `Panel ${productName}` : productName}</p>
              <p className="text-zinc-500 text-[10px] uppercase tracking-wider mt-1 font-bold">Total Tagihan</p>
            </div>
            <p className="text-teal-400 font-black text-xl">{formatPrice(productPrice)}</p>
          </div>
        </div>

        {/* Form Data Pembeli */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6 space-y-4">
          <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Data Pembeli</h2>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nama Lengkap"
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:border-teal-500 transition-colors outline-none text-white"
          />
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="No. WhatsApp (Contoh: 0812...)"
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:border-teal-500 transition-colors outline-none text-white"
          />
          
          {productType === "panel" && (
            <div className="p-3 bg-teal-500/5 border border-teal-500/20 rounded-lg mt-2">
              <label className="flex items-center gap-2 text-[10px] text-teal-400 mb-2 font-black uppercase tracking-wider">
                <UserCircle className="w-3.5 h-3.5" /> Username Panel
              </label>
              <input
                type="text"
                value={panelUsername}
                onChange={(e) => setPanelUsername(e.target.value)}
                placeholder="Contoh: zenon_user"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-sm outline-none focus:border-teal-400 text-white"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleShowQris}
          className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest bg-teal-500 text-black shadow-lg shadow-teal-500/10 hover:bg-teal-400 hover:-translate-y-0.5 active:scale-95 transition-all"
        >
          Bayar Sekarang
        </button>

        {/* Modal QRIS */}
        {showQrisModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300 shadow-2xl">
              <button 
                onClick={() => setShowQrisModal(false)}
                className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-rose-500/80 rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="p-6 text-center">
                <h3 className="text-lg font-bold mb-1 text-white italic">SCAN QRIS</h3>
                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-4">Selesaikan Pembayaran</p>
                
                <div className="bg-white p-3 rounded-xl mb-4 inline-block shadow-inner">
                  <img src={QRIS_IMAGE_URL} alt="QRIS ZenonStore" className="w-48 h-48 sm:w-60 sm:h-60 object-contain" />
                </div>

                <button
                  onClick={handleDownloadQris}
                  className="flex items-center gap-2 mx-auto mb-6 text-teal-400 hover:text-teal-300 text-[10px] font-bold transition-all bg-teal-400/5 px-4 py-2 rounded-full border border-teal-400/10 hover:border-teal-400/30"
                >
                  <Download className="w-3.5 h-3.5" />
                  SIMPAN KE GALERI
                </button>
                
                <div className="bg-zinc-800/80 p-3 rounded-lg mb-6 border border-zinc-700">
                  <p className="text-zinc-500 text-[9px] uppercase font-black tracking-[0.2em]">Total Tagihan</p>
                  <p className="text-teal-400 text-2xl font-black italic">{formatPrice(productPrice)}</p>
                </div>

                <button
                  onClick={handleConfirmWhatsApp}
                  className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 active:scale-95 transition-all"
                >
                  Kirim Bukti Pembayaran
                </button>
                <p className="text-[9px] text-zinc-500 mt-4 italic">*Admin akan memproses pesanan dalam 1-10 menit</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-teal-400"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
