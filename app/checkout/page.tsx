"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2"; 
import withReactContent from "sweetalert2-react-content";
import { 
  ArrowLeft, 
  X,
  Download,
  UserCircle,
  MessageSquare,
  Loader2
} from "lucide-react";

const MySwal = withReactContent(Swal);
const WHATSAPP_NUMBER = "6285701961876";
const TELEGRAM_URL = "https://t.me/username_tele_kamu"; // <-- GANTI USERNAME TELEGRAM ASLIMU DI SINI
const QRIS_IMAGE_URL = "/images/qristano.png"; 

const toastKeren = (title: string, text: string, icon: 'warning' | 'error' | 'info') => {
  MySwal.fire({
    title: <span className="text-white font-black italic uppercase tracking-tighter text-xl">{title}</span>,
    html: <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">{text}</span>,
    icon: icon,
    iconColor: '#6C3CE1',
    background: '#0c0c1e',
    confirmButtonText: 'OKE SIAP',
    confirmButtonColor: '#6C3CE1',
    scrollbarPadding: false,
    heightAuto: false,
    customClass: {
      popup: 'border-2 border-[#6C3CE1]/30 rounded-[2rem] shadow-[0_0_30px_rgba(108,60,225,0.2)]',
      confirmButton: 'rounded-xl font-black px-10 py-3 text-xs tracking-widest active:scale-95 transition-all'
    }
  });
};

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
  const quantity = parseInt(searchParams.get("qty") || "1"); // Mengambil jumlah beli

  const totalPrice = productPrice * quantity; // Total harga kumulatif

  const handleDownloadQris = () => {
    const link = document.createElement("a");
    link.href = QRIS_IMAGE_URL;
    link.download = "QRIS-TanoPedia.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleActionBayar = () => {
    if (!customerName || !customerPhone) {
      toastKeren("DATA KOSONG", "Mohon lengkapi Nama dan No. WhatsApp!", "warning");
      return;
    }
    if (productType === "panel" && !panelUsername) {
      toastKeren("USN PANEL", "Mohon isi Username untuk akun Panel Anda!", "info");
      return;
    }

    if (productType === "panel") {
      // JIKA PANEL: Langsung lempar ke Telegram membawa data teks formatan
      const message = `Halo Admin TanoPedia,%0A%0A` +
                      `*ORDER PANEL VIA TELEGRAM*%0A` +
                      `----------------------------%0A` +
                      `- Pesanan: *Panel - ${productName}*%0A` +
                      `- Data Nama: ${customerName}%0A` +
                      `- No. WA: ${customerPhone}%0A` +
                      `- Request USN: *${panelUsername}*%0A` +
                      `----------------------------%0A` +
                      `Saya ingin memesan paket panel ini via Telegram.`;
      window.open(`${TELEGRAM_URL}?text=${message}`, "_blank");
    } else {
      // JIKA SCRIPT/APP: Buka Modal QRIS bawaan asli kamu
      setShowQrisModal(true);
    }
  };

  const handleConfirmWhatsApp = () => {
    let categoryLabel = productType === "script" ? "Script" : "Aplikasi";

    const message = `Halo Admin TanoPedia,%0A%0A` +
                    `*` + `KONFIRMASI PEMBAYARAN QRIS*%0A` +
                    `----------------------------%0A` +
                    `- Pesanan: *${categoryLabel} - ${productName}*%0A` +
                    `- Jumlah Beli: *${quantity}x*%0A` +
                    `- Total Bayar: *${formatPrice(totalPrice)}*%0A%0A` +
                    `*Data Pembeli:*%0A` +
                    `- Nama: ${customerName}%0A` +
                    `- No. WA: ${customerPhone}%0A` +
                    `----------------------------%0A` +
                    `Saya sudah scan QRIS, berikut saya lampirkan bukti transfernya.`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8 px-3 sm:px-4 lg:px-6 text-foreground transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <Link href="/#products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-[#6C3CE1] mb-6 text-sm font-semibold transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Produk
        </Link>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-black uppercase italic tracking-tight text-foreground">Checkout</h1>
          <p className="text-muted-foreground text-xs sm:text-sm font-medium">Lengkapi Data Pemesanan Anda</p>
        </div>

        {/* Ringkasan Pembayaran */}
        <div className="bg-card border border-border rounded-xl p-5 mb-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-foreground font-bold">{productType === "panel" ? `Panel ${productName}` : productName}</p>
              <p className="text-muted-foreground text-[11px] mt-1 italic font-medium">
                {quantity}x barang ({formatPrice(productPrice)} / item)
              </p>
            </div>
            <p className="text-[#6C3CE1] dark:text-purple-400 font-extrabold text-xl">{formatPrice(totalPrice)}</p>
          </div>
        </div>

        {/* Form Data Pembeli */}
        <div className="bg-card border border-border rounded-xl p-5 mb-6 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Data Pembeli</h2>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nama Lengkap"
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:border-[#6C3CE1] outline-none text-foreground"
          />
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="No. WhatsApp (Aktif)"
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:border-[#6C3CE1] outline-none text-foreground"
          />
          {productType === "panel" && (
            <div className="p-3 bg-[#6C3CE1]/5 border border-[#6C3CE1]/20 rounded-lg">
              <label className="flex items-center gap-2 text-xs text-[#6C3CE1] dark:text-purple-300 mb-2 font-bold">
                <UserCircle className="w-4 h-4" /> Username Panel
              </label>
              <input
                type="text"
                value={panelUsername}
                onChange={(e) => setPanelUsername(e.target.value)}
                placeholder="Contoh: tano"
                className="w-full bg-card border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-[#6C3CE1] text-foreground"
              />
            </div>
          )}
        </div>

        {/* Tombol Utama Dinamis */}
        <button
          onClick={handleActionBayar}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all cursor-pointer uppercase tracking-wider text-sm flex items-center justify-center gap-2 ${
            productType === "panel" 
              ? "bg-blue-500 shadow-blue-500/20 hover:bg-blue-600" 
              : "bg-gradient-to-r from-[#6C3CE1] to-[#a855f7] shadow-[#6C3CE1]/25"
          }`}
        >
          {productType === "panel" ? (
            <>
              <MessageSquare className="w-4 h-4" /> Order via Telegram
            </>
          ) : (
            "Bayar Sekarang"
          )}
        </button>

        {/* Modal QRIS */}
        {showQrisModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-card border border-border w-full max-w-sm rounded-2xl overflow-hidden relative shadow-2xl">
              <button 
                onClick={() => setShowQrisModal(false)}
                className="absolute top-3 right-3 p-2 bg-foreground/5 hover:bg-foreground/10 rounded-full text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 text-center">
                <h3 className="text-lg font-bold mb-1 text-foreground">Scan QRIS</h3>
                <p className="text-muted-foreground text-xs mb-4">Silakan selesaikan pembayaran</p>

                <div className="bg-white p-3 rounded-xl mb-3 inline-block shadow-md">
                  <img src={QRIS_IMAGE_URL} alt="QRIS TanoPedia" className="w-48 h-48 sm:w-64 sm:h-64 object-contain" />
                </div>

                <button
                  onClick={handleDownloadQris}
                  className="flex items-center gap-2 mx-auto mb-5 text-[#6C3CE1] dark:text-purple-300 hover:opacity-80 text-xs font-bold transition-all bg-[#6C3CE1]/10 px-4 py-2 rounded-full border border-[#6C3CE1]/20 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Simpan QRIS ke Galeri
                </button>

                <div className="bg-background border border-border p-3 rounded-lg mb-6">
                  <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Total Tagihan</p>
                  <p className="text-[#6C3CE1] dark:text-purple-400 text-2xl font-black italic">{formatPrice(totalPrice)}</p>
                </div>

                <button
                  onClick={handleConfirmWhatsApp}
                  className="w-full py-4 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer uppercase tracking-wide text-xs"
                >
                  Sudah Bayar? Kirim Bukti
                </button>
                <p className="text-[10px] text-muted-foreground mt-3 italic">*Lampirkan bukti transfer di WhatsApp</p>
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
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-[#6C3CE1]"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
