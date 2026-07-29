/**
 * Loads Razorpay's checkout.js once and exposes a small typed wrapper around
 * `new Razorpay(options).open()`. Used by the "Generate Bill" flow on the
 * Sevas & Services page: Generate Bill -> Razorpay opens -> Payment Success
 * -> verify + save invoice.
 */

declare global {
  interface Window {
    Razorpay: any;
  }
}

let scriptPromise: Promise<void> | null = null;

export function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Could not load Razorpay checkout script"));
    };
    document.body.appendChild(script);
  });

  return scriptPromise;
}

export interface OpenRazorpayCheckoutOptions {
  key: string;
  amount: number; // paise
  currency: string;
  orderId: string;
  name?: string;
  description?: string;
  prefill?: { name?: string; contact?: string; email?: string };
  onSuccess: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  onDismiss?: () => void;
}

export async function openRazorpayCheckout(opts: OpenRazorpayCheckoutOptions) {
  await loadRazorpayScript();

  const rzp = new window.Razorpay({
    key: opts.key,
    amount: opts.amount,
    currency: opts.currency,
    order_id: opts.orderId,
    name: opts.name || "Sansthan",
    description: opts.description || "Seva payment",
    prefill: opts.prefill || {},
    theme: { color: "#b45309" },
    handler: (response: any) => {
      opts.onSuccess({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });
    },
    modal: {
      ondismiss: () => opts.onDismiss?.(),
    },
  });

  rzp.open();
}