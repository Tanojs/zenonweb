"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ALL_PRODUCTS } from "@/components/products-section";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { 
  X, 
  Plus, 
  Minus, 
  CreditCard, 
  Check, 
  MessageSquare, 
  Loader2 
} from "lucide-react";

const MySwal = withReactContent(Swal);
const TELEGRAM_BOT_URL = "https://t.me/username_bot_kamu"; // <-- GANTI DENGAN LINK BOT KAMU

const toastKeren = (title: string, text: string, icon: 'warning' | 'error' | 'info') => {
  MySwal.fire({
    title: <span className="text-white font-black italic uppercase tracking-tighter text-xl">{title}</span>,
    html: <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">{text}</span>,
    icon: icon,
    iconColor: '#6C3CE1',
    background: '#0c0c1e',
    confirmButtonText: 'OKE SIAP',
    confirmButtonColor: '#6C3CE1',
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
  
  const [quantity, setQuantity] = useState<number>(1);
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const productId = parseInt(searchParams.get("id") || "0");
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

  // LOGIKA PEMBAYARAN OTOMATIS
  const handleActionBayar = async () => {
    if (isPanel) {
      window.open(TELEGRAM_BOT_URL, "_blank");
      return;
    }

    if (!customerName || !whatsappNumber) {
      toastKeren("DATA KOSONG", "Mohon lengkapi Nama dan No. WhatsApp Anda!", "warning");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.name,
          price: product.price,
          quantity: quantity,
          customerName: customerName,
          whatsappNumber: whatsappNumber
        })
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || "Gagal membuat invoice");
      }

      // REDIRECT KE LINK PEMBAYARAN PAKASIR (NOMINAL OTOMATIS)
      window.location.href = resData.paymentUrl;

    } catch (error: any) {
      toastKeren("PAYMENT ERROR", error.message || "Gagal memproses pembayaran otomatis", "error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8 px-3 sm:px-4 lg:px-6 text-foreground transition-colors duration-300 flex items-center justify-center">
      <div className="bg-card border border-border w-full max-w-md rounded-[24px] p-5 relative shadow-2xl text-left">
        
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">🛒 Detail Pesanan</h3>
          <button onClick={() => router.push("/#products")} className="p-1 rounded-full bg-muted border border-border text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

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

        {!isPanel ? (
          <>
            <div className="mb-4">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Jumlah Beli</label>
              <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden w-full">
                <button disabled={loading} onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="p-2.5 px-4 bg-muted/40 hover:bg-muted text-foreground transition-colors cursor-pointer disabled:opacity-50"><Minus className="w-3.5 h-3.5" /></button>
                <div className="flex-1 text-center font-extrabold text-sm text-foreground">{quantity}</div>
                <button disabled={loading} onClick={() => setQuantity(quantity + 1)} className="p-2.5 px-4 bg-muted/40 hover:bg-muted text-foreground transition-colors cursor-pointer disabled:opacity-50"><Plus className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Metode Pembayaran</label>
              <div className="border-2 border-purple-500 bg-purple-500/5 rounded-xl p-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-lg border border-purple-500/30"><CreditCard className="w-4 h-4 text-purple-500" /></div>
                  <div>
                    <p className="text-xs font-extrabold text-foreground">Pakasir Otomatis</p>
                    <p className="text-[10px] text-muted-foreground">QRIS, VA, E-Wallet (Instan)</p>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>
              </div>
            </div>

            <div className="mb-4 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Nama Pembeli</label>
                <input type="text" disabled={loading} placeholder="Masukkan nama" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-purple-500 outline-none font-medium disabled:opacity-60" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Nomor WhatsApp</label>
                <input type="tel" disabled={loading} placeholder="812xxxxxxxx" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-purple-500 outline-none font-medium disabled:opacity-60" />
              </div>
            </div>
          </>
        ) : (
          <div className="mb-5 bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 text-xs text-muted-foreground shadow-sm">
            💡 Layanan <strong>Panel Hosting</strong> diproses via Bot Telegram.
          </div>
        )}

        <div className="flex items-center gap-3 pt-3 border-t border-border mt-4">
          <button onClick={() => router.push("/#products")} className="flex-1 bg-background border border-border text-muted-foreground hover:bg-muted font-bold text-xs py-3.5 rounded-xl text-center uppercase tracking-wider transition-all cursor-pointer">Batal</button>
          <button onClick={handleActionBayar} disabled={loading} className="flex-1 font-bold text-xs py-3.5 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider shadow-md text-white bg-gradient-to-r from-purple-600 to-purple-500 disabled:opacity-75">
            {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading...</> : isPanel ? "Order via Bot" : "Beli Sekarang →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
