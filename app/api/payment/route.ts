import { NextRequest, NextResponse } from "next/server";

// =====================================================
// KONFIGURASI PAYMENT GATEWAY
// Ganti dengan API key kamu saat sudah daftar
// =====================================================

// Midtrans Config
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY || "";
const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true";

// Tripay Config
const TRIPAY_API_KEY = process.env.TRIPAY_API_KEY || "";
const TRIPAY_PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY || "";
const TRIPAY_MERCHANT_CODE = process.env.TRIPAY_MERCHANT_CODE || "";
const TRIPAY_IS_PRODUCTION = process.env.TRIPAY_IS_PRODUCTION === "true";

// Helper: Generate Order ID
function generateOrderId() {
  return `ZS-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

// =====================================================
// MIDTRANS INTEGRATION
// Dokumentasi: https://docs.midtrans.com/
// =====================================================
async function createMidtransTransaction(data: {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productName: string;
}) {
  const baseUrl = MIDTRANS_IS_PRODUCTION
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";

  const authString = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64");

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${authString}`,
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: data.orderId,
        gross_amount: data.amount,
      },
      item_details: [
        {
          id: data.orderId,
          price: data.amount,
          quantity: 1,
          name: data.productName,
        },
      ],
      customer_details: {
        first_name: data.customerName,
        email: data.customerEmail,
        phone: data.customerPhone,
      },
    }),
  });

  return response.json();
}

// =====================================================
// TRIPAY INTEGRATION
// Dokumentasi: https://tripay.co.id/developer
// =====================================================
async function createTripayTransaction(data: {
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productName: string;
  paymentMethod: string;
}) {
  const baseUrl = TRIPAY_IS_PRODUCTION
    ? "https://tripay.co.id/api/transaction/create"
    : "https://tripay.co.id/api-sandbox/transaction/create";

  const orderId = generateOrderId();
  
  // Generate signature
  const crypto = await import("crypto");
  const signature = crypto
    .createHmac("sha256", TRIPAY_PRIVATE_KEY)
    .update(`${TRIPAY_MERCHANT_CODE}${orderId}${data.amount}`)
    .digest("hex");

  // Map payment method
  const paymentMethodMap: Record<string, string> = {
    qris: "QRIS",
    ewallet: "OVO", // Default ke OVO, bisa diubah
    bank: "BRIVA", // Default ke BRI VA
    card: "CREDITCARD",
  };

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TRIPAY_API_KEY}`,
    },
    body: JSON.stringify({
      method: paymentMethodMap[data.paymentMethod] || "QRIS",
      merchant_ref: orderId,
      amount: data.amount,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone,
      order_items: [
        {
          name: data.productName,
          price: data.amount,
          quantity: 1,
        },
      ],
      signature,
    }),
  });

  return response.json();
}

// =====================================================
// API ROUTE HANDLER
// =====================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gateway, ...transactionData } = body;

    // Validate required fields
    if (!transactionData.amount || !transactionData.customerName || !transactionData.customerEmail) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Process based on gateway
    switch (gateway) {
      case "midtrans": {
        if (!MIDTRANS_SERVER_KEY) {
          return NextResponse.json(
            { success: false, message: "Midtrans not configured" },
            { status: 500 }
          );
        }
        const result = await createMidtransTransaction({
          orderId: generateOrderId(),
          ...transactionData,
        });
        return NextResponse.json({ success: true, data: result });
      }

      case "tripay": {
        if (!TRIPAY_API_KEY || !TRIPAY_PRIVATE_KEY) {
          return NextResponse.json(
            { success: false, message: "Tripay not configured" },
            { status: 500 }
          );
        }
        const result = await createTripayTransaction(transactionData);
        return NextResponse.json({ success: true, data: result });
      }

      default:
        return NextResponse.json(
          { success: false, message: "Invalid payment gateway" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Payment API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// =====================================================
// WEBHOOK HANDLER (untuk konfirmasi pembayaran)
// =====================================================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Verify webhook signature
    // TODO: Update order status in database
    // TODO: Send notification to customer
    
    console.log("Payment webhook received:", body);
    
    return NextResponse.json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { success: false, message: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
