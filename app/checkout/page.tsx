"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ALL_PRODUCTS } from "@/components/products-section"; // <-- Sesuaikan jalur import katalog depan kamu
import Link from "next/link";
import Swal from "sweetalert2"; 
import withReactContent from "sweetalert2-react-content";
import { 
  X, 
  Plus, 
  Minus, 
  CreditCard, 
  Check, 
  MessageSquare, 
  Download,
  Loader2 
} from "lucide-react";

const MySwal = withReactContent(Swal);
const WHATSAPP_NUMBER = "6285701961876";
const TELEGRAM_BOT_URL = "https://t.me/tanoxds"; // <-- GANTI DENGAN LINK BOT TELEGRAM KAMU DI SINI
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
  return `Rp ${price.toLocaleString("id-ID")}`;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showQrisModal, setShowQrisModal] = useState(false);

  const [quantity, setQuantity] = useState<number>(1);
  const [whatsappNumber, setWhatsappNumber] = useState<string>( "");
  const [customerName, setCustomerName] = useState<string>( "");

  // Mengambil ID dari parameter URL halaman depan
  const productId = parseInt(searchParams.get("id") || "0");
  // Mencari data detail produk di dalam array ALL_PRODUCTS hasil import
  const product = ALL_PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground p-4 text-center">
        <p className="font-bold text-sm mb-4">Waduh, Data Produk tidak ditemukan!</p>
        <button onClick={() => router.push("/#products")} className="bg-[#6C3CE1] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer">
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  const isPanel = product.categoryType === "panel";
  const totalPrice = product.price * quantity;

  const handleDownloadQris = () => {
    const link = document.createElement("a");
    link.href = QRIS_IMAGE_URL;
    link.download = "QRIS-TanoPedia.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleActionBayar = () => {
    if (isPanel) {
      window.open(TELEGRAM_BOT_URL, "_blank");
    } else {
      if (!customerName || !whatsappNumber) {
        toastKeren("DATA KOSONG", "Mohon lengkapi Nama dan No. WhatsApp Anda!", "warning");
        return;
      }
      setShowQrisModal(true);
    }
  };

  const handleConfirmWhatsApp = () => {
    const message = `Halo Admin TanoPedia,%0A%0A` +
                    `*KONFIRMASI PEMBAYARAN QRIS*%0A` +
                    `----------------------------%0A` +
                    `- Pesanan: *${product.badge} - ${product.name}*%0A` +
                    `- Jumlah Beli: *${quantity}x*%0A` +
                    `- Total Bayar: *${formatPrice(totalPrice)}*%0A%0A` +
                    `*Data Pembeli:*%0A` +
                    `- Nama: ${customerName}%0A` +
                    `- No. WA: ${whatsappNumber}%0A` +
                    `----------------------------%0A` +
                    `Saya sudah scan QRIS, berikut saya lampirkan bukti transfernya.`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8 px-3 sm:px-4 lg:px-6 text-foreground transition-colors duration-300 flex items-center justify-center">
      <div className="bg-card border border-border w-full max-w-md rounded-[24px] p-5 relative shadow-2xl text-left">
        
        {/* Header Detail Pesanan */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">🛒 Detail Pesanan</h3>
          <button onClick={() => router.push("/#products")} className="p-1 rounded-full bg-muted border border-border text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Kotak Info Item Dipilih */}
        <div className="bg-muted/30 border border-border/60 rounded-2xl p-3.5 mb-4">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1">ITEM DIPILIH</span>
          <h4 className="font-extrabold text-sm text-foreground leading-snug">{product.name}</h4>
          <div className="border-l-2 border-purple-500 bg-purple-500/5 p-2.5 my-2.5 rounded-r-xl text-[11px] text-muted-foreground leading-relaxed">
            {product.description}
          </div>
          <div className="flex justify-between items-center text-xs pt-1.5 border-t border-border/40">
            <span className="font-bold text-muted-foreground uppercase tracking-wide text-[10px]">
              {isPanel ? "Mulai Dari" : "Harga Satuan"}
            </span>
            <span className="font-extrabold text-purple-500">{formatPrice(product.price)}</span>
          </div>
        </div>

        {/* FORM DINAMIS: Hanya dirender jika produk BUKAN tipe panel */}
        {!isPanel ? (
          <>
            {/* Bagian Jumlah Beli */}
            <div className="mb-4">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Jumlah Beli</label>
              <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden w-full">
                <button 
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="p-2.5 px-4 bg-muted/40 hover:bg-muted text-foreground transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1 text-center font-extrabold text-sm text-foreground">{quantity}</div>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 px-4 bg-muted/40 hover:bg-muted text-foreground transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bagian Metode Pembayaran */}
            <div className="mb-4">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Metode Pembayaran</label>
              <div className="border-2 border-purple-500 bg-purple-500/5 rounded-xl p-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-lg border border-purple-500/30">
                    <CreditCard className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-foreground">QRIS (Otomatis)</p>
                    <p className="text-[10px] text-muted-foreground">Scan via DANA, GoPay, OVO, ShopeePay, dll.</p>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
            </div>

            {/* Form Identitas Pembeli */}
            <div className="mb-4 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Nama Pembeli</label>
                <input 
                  type="text" 
                  placeholder="Masukkan nama lengkap" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-purple-500 outline-none font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Nomor WhatsApp Aktif</label>
                <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden px-3 py-1">
                  <span className="text-xs font-bold text-muted-foreground border-r border-border pr-3 mr-3">+62</span>
                  <input 
                    type="tel" 
                    placeholder="812xxxxxxxx" 
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full bg-transparent text-sm text-foreground focus:outline-none font-medium py-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Kotak Total Bayar (Hanya Script & App) */}
            <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 flex items-center justify-between mb-5">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide text-[11px]">Total Bayar</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400 text-base sm:text-lg">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </>
        ) : (
          /* JIKA PRODUK PANEL: Tampilkan Notice */
          <div className="mb-5 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-xs text-muted-foreground leading-relaxed shadow-sm">
            💡 Untuk pemesanan layanan <strong>Panel Hosting</strong>, transaksi dan pemilihan spesifikasi paket dilakukan secara langsung melalui sistem otomatis kami di Bot Telegram.
          </div>
        )}

        {/* Tombol Aksi Bawah */}
        <div className="flex items-center gap-3 pt-3 border-t border-border mt-4">
          <button 
            onClick={() => router.push("/#products")}
            className="flex-1 bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40 font-bold text-xs py-3.5 rounded-xl text-center uppercase tracking-wider transition-all cursor-pointer"
          >
            Batal
          </button>

          <button
            onClick={handleActionBayar}
            className={`flex-1 font-bold text-xs py-3.5 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider shadow-md cursor-pointer text-white whitespace-nowrap ${
              isPanel 
                ? "bg-blue-500 hover:bg-blue-600 shadow-blue-500/10" 
                : "bg-gradient-to-r from-purple-600 to-purple-500 shadow-purple-500/15"
            }`}
          >
            {isPanel ? (
              <>
                <MessageSquare className="w-3.5 h-3.5" /> Order via Bot
              </>
            ) : (
              "Beli Sekarang →"
            )}
          </button>
        </div>

      </div>

      {/* MODAL POP-UP QRIS */}
      {showQrisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border border-border w-full max-w-sm rounded-2xl overflow-hidden relative shadow-2xl p-6 text-center">
            <button 
              onClick={() => setShowQrisModal(false)}
              className="absolute top-3 right-3 p-2 bg-foreground/5 hover:bg-foreground/10 rounded-full text-foreground transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold mb-1 text-foreground">Scan QRIS</h3>
            <p className="text-muted-foreground text-xs mb-4">Silakan selesaikan pembayaran</p>

            <div className="bg-white p-3 rounded-xl mb-3 inline-block shadow-md">
              <img src={QRIS_IMAGE_URL} alt="QRIS TanoPedia" className="w-48 h-48 sm:w-64 sm:h-64 object-contain" />
            </div>

            <button
              onClick={handleDownloadQris}
              className="flex items-center gap-2 mx-auto mb-5 text-purple-500 dark:text-purple-300 hover:opacity-80 text-xs font-bold transition-all bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Simpan QRIS ke Galeri
            </button>

            <div className="bg-background border border-border p-3 rounded-lg mb-6">
              <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Total Tagihan</p>
              <p className="text-purple-500 dark:text-purple-400 text-2xl font-black italic">{formatPrice(totalPrice)}</p>
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
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center text-purple-500">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
