"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { 
  ArrowLeft, 
  Loader2,
  UserCircle,
  X,
  Download,
  ShieldCheck,
  Zap
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
    if (!customerName || !customerPhone) {
      MySwal.fire({
        title: <span className="text-white font-black italic uppercase tracking-tighter">Warning!</span>,
        html: <span className="text-zinc-400 text-xs">Lengkapi data diri lu dulu cik sebelum lanjut pembayaran.</span>,
        icon: "warning",
        background: "#09090b",
        confirmButtonColor: "#14b8a6",
        confirmButtonText: "OKE",
        customClass: { popup: 'rounded-3xl border border-zinc-800' }
      });
      return;
    }
    if (productType === "panel" && !panelUsername) {
      MySwal.fire({
        title: <span className="text-white font-black italic uppercase tracking-tighter">Missed Info</span>,
        html: <span className="text-zinc-400 text-xs">Username Panel wajib diisi biar akunnya bisa langsung dibuat!</span>,
        icon: "info",
        background: "#09090b",
        confirmButtonColor: "#14b8a6",
        confirmButtonText: "SIAP",
        customClass: { popup: 'rounded-3xl border border-zinc-800' }
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
    <div className="min-h-screen bg-zinc-950 py-10 px-4 text-zinc-100 selection:bg-teal-500/30">
      <div className="max-w-xl mx-auto relative">
        {/* Background Glow Orbs */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

        <Link href="/#products" className="group inline-flex items-center gap-2 text-zinc-500 hover:text-teal-400 mb-8 text-xs font-bold uppercase tracking-widest transition-all">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Kembali ke Katalog
        </Link>

        <header className="mb-10">
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">
            Secure <span className="text-teal-400">Checkout</span>
          </h1>
          <div className="h-1 w-20 bg-teal-500 rounded-full" />
        </header>

        {/* Ringkasan Pesanan Card */}
        <div className="relative group mb-8">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-zinc-800 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-zinc-900 border border-zinc-800/50 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="text-[10px] font-black text-teal-400 uppercase tracking-[0.3em] mb-2 block">Item Selected</span>
                        <h2 className="text-xl font-bold text-white italic uppercase tracking-tight">{productType === "panel" ? `Panel ${productName}` : productName}</h2>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-1 block">Subtotal</span>
                        <p className="text-2xl font-black text-white italic tracking-tighter">{formatPrice(productPrice)}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Form Section */}
        <div className="space-y-6 mb-10">
          <div className="grid gap-4">
            <div className="relative">
                <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="NAMA LENGKAP"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-5 py-4 text-xs font-bold uppercase tracking-widest focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all outline-none text-white placeholder:text-zinc-600"
                />
            </div>
            <div className="relative">
                <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="WHATSAPP NUMBER"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-5 py-4 text-xs font-bold uppercase tracking-widest focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all outline-none text-white placeholder:text-zinc-600"
                />
            </div>
          </div>
          
          {productType === "panel" && (
            <div className="relative p-5 bg-teal-500/[0.03] border border-teal-500/20 rounded-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <UserCircle className="w-12 h-12 text-teal-400" />
                </div>
                <label className="flex items-center gap-2 text-[10px] text-teal-400 mb-3 font-black uppercase tracking-[0.2em]">
                    <Zap className="w-3 h-3 fill-teal-400" /> Username Panel
                </label>
                <input
                    type="text"
                    value={panelUsername}
                    onChange={(e) => setPanelUsername(e.target.value)}
                    placeholder="CONTOH: ZENON_USER"
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-teal-400 transition-all text-white"
                />
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleShowQris}
          className="relative w-full group overflow-hidden"
        >
            <div className="absolute inset-0 bg-teal-400 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
            <div className="relative flex items-center justify-center gap-3 py-5 rounded-xl font-black text-xs uppercase tracking-[0.3em] border-2 border-teal-500 text-teal-500 group-hover:text-black transition-colors duration-500">
                PROCEED TO PAYMENT <ShieldCheck className="w-4 h-4" />
            </div>
        </button>

        <p className="text-center text-[10px] text-zinc-600 mt-8 font-bold uppercase tracking-widest">
            ZenonStore Infrastructure &bull; Secure Encrypted
        </p>

        {/* Modal QRIS Futuristik */}
        {showQrisModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-xl transition-all">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[2rem] overflow-hidden relative animate-in fade-in zoom-in slide-in-from-bottom-10 duration-500 shadow-[0_0_50px_rgba(20,184,166,0.1)]">
              
              <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-500 animate-pulse"></div>

              <button 
                onClick={() => setShowQrisModal(false)}
                className="absolute top-6 right-6 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-white transition-all active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="p-8 text-center">
                <header className="mb-6">
                    <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Finalize Payment</h3>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1 italic">Scan QRIS to Complete Order</p>
                </header>
                
                <div className="relative group inline-block mb-6">
                    <div className="absolute -inset-4 bg-teal-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-white p-4 rounded-3xl shadow-2xl transition-transform group-hover:scale-[1.02] duration-500">
                        <img src={QRIS_IMAGE_URL} alt="QRIS" className="w-52 h-52 sm:w-64 sm:h-64 object-contain" />
                    </div>
                </div>

                <button
                  onClick={handleDownloadQris}
                  className="flex items-center gap-2 mx-auto mb-8 text-zinc-400 hover:text-white text-[9px] font-black tracking-widest uppercase transition-all bg-zinc-800/50 px-5 py-2.5 rounded-full border border-zinc-800"
                >
                  <Download className="w-3 h-3" /> Save QR Code
                </button>
                
                <div className="bg-zinc-950 p-6 rounded-2xl mb-8 border border-zinc-800 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl"></div>
                   <p className="text-zinc-500 text-[9px] uppercase font-black tracking-[0.3em] mb-1">Invoice Total</p>
                   <p className="text-teal-400 text-3xl font-black italic tracking-tighter leading-none">{formatPrice(productPrice)}</p>
                </div>

                <button
                  onClick={handleConfirmWhatsApp}
                  className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-white text-black hover:bg-teal-400 transition-all shadow-xl shadow-white/5 active:scale-95"
                >
                  Confirm on WhatsApp
                </button>
                <p className="text-[9px] text-zinc-600 mt-5 font-bold uppercase tracking-[0.1em]">Verification might take up to 5 minutes</p>
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
