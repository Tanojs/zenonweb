"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2"; // Pake ini buat notif keren
import withReactContent from "sweetalert2-react-content";
import { 
  ArrowLeft, 
  QrCode,
  CheckCircle2,
  Loader2,
  Shield,
  Zap,
  UserCircle,
  X,
  Download
} from "lucide-react";

const MySwal = withReactContent(Swal);

// KONFIGURASI NOTIFIKASI KEREN (Glow Style)
const toastKeren = (title: string, text: string, icon: 'warning' | 'error' | 'info') => {
  MySwal.fire({
    title: <span className="text-white font-black italic uppercase tracking-tighter text-xl">{title}</span>,
    html: <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">{text}</span>,
    icon: icon,
    iconColor: '#14b8a6',
    background: '#09090b', // Hitam pekat
    confirmButtonText: 'OKE SIAP',
    confirmButtonColor: '#14b8a6',
    buttonsStyling: true,
    showClass: {
      popup: 'animate__animated animate__fadeInUp animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutDown animate__faster'
    },
    customClass: {
      popup: 'border-2 border-teal-500/30 rounded-[2rem] shadow-[0_0_30px_rgba(20,184,166,0.1)]',
      confirmButton: 'rounded-xl font-black px-8 py-3 text-xs tracking-widest'
    }
  });
};

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
    // DISINI NOTIFNYA JADI KEREN
    if (!customerName || !customerPhone) {
      toastKeren("ACCESS DENIED", "Lengkapi Nama & No. WhatsApp dulu cik!", "warning");
      return;
    }
    if (productType === "panel" && !panelUsername) {
      toastKeren("DATA NEEDED", "Username Panel jangan dikosongin ya!", "info");
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
    <div className="min-h-screen bg-zinc-950 py-6 sm:py-8 px-3 sm:px-4 lg:px-6 text-zinc-100">
      <div className="max-w-2xl mx-auto">
        <Link href="/#products" className="inline-flex items-center gap-2 text-zinc-400 hover:text-teal-400 mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Produk
        </Link>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">Checkout</h1>
          <p className="text-zinc-400 text-sm">Scan QRIS dan Konfirmasi</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white font-medium">{productType === "panel" ? `Panel ${productName}` : productName}</p>
              <p className="text-zinc-500 text-xs mt-1 italic">Total yang harus dibayar:</p>
            </div>
            <p className="text-teal-400 font-bold text-xl">{formatPrice(productPrice)}</p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6 space-y-4">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Data Pembeli</h2>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nama Lengkap"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:border-teal-500 outline-none"
          />
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="No. WhatsApp (Aktif)"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:border-teal-500 outline-none"
          />
          {productType === "panel" && (
            <div className="p-3 bg-teal-500/5 border border-teal-500/20 rounded-lg">
              <label className="flex items-center gap-2 text-xs text-teal-400 mb-2 font-bold"><UserCircle className="w-4 h-4" /> Username Panel</label>
              <input
                type="text"
                value={panelUsername}
                onChange={(e) => setPanelUsername(e.target.value)}
                placeholder="Contoh: zenon"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-sm outline-none focus:border-teal-400"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleShowQris}
          className="w-full py-4 rounded-xl font-bold bg-teal-500 text-black shadow-lg shadow-teal-500/20 hover:bg-teal-400 transition-all"
        >
          Bayar Sekarang
        </button>

        {showQrisModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300">
              <button 
                onClick={() => setShowQrisModal(false)}
                className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-black/50 rounded-full text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="p-6 text-center">
                <h3 className="text-lg font-bold mb-1 text-white">Scan QRIS</h3>
                <p className="text-zinc-400 text-xs mb-4">Silakan selesaikan pembayaran</p>
                
                <div className="bg-white p-3 rounded-xl mb-3 inline-block shadow-lg">
                  <img src={QRIS_IMAGE_URL} alt="QRIS ZenonStore" className="w-48 h-48 sm:w-64 sm:h-64 object-contain" />
                </div>

                <button
                  onClick={handleDownloadQris}
                  className="flex items-center gap-2 mx-auto mb-5 text-teal-400 hover:text-teal-300 text-xs font-semibold transition-colors bg-teal-400/10 px-4 py-2 rounded-full border border-teal-400/20"
                >
                  <Download className="w-4 h-4" />
                  Simpan QRIS ke Galeri
                </button>
                
                <div className="bg-zinc-800 p-3 rounded-lg mb-6">
                  <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Total Tagihan</p>
                  <p className="text-teal-400 text-2xl font-black">{formatPrice(productPrice)}</p>
                </div>

                <button
                  onClick={handleConfirmWhatsApp}
                  className="w-full py-4 rounded-xl font-bold bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                >
                  Sudah Bayar? Kirim Bukti
                </button>
                <p className="text-[10px] text-zinc-500 mt-3 italic">*Lampirkan bukti transfer di WhatsApp</p>
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
