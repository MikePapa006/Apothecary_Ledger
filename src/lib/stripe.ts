import Stripe from "stripe";

// Server-side Stripe client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
  typescript: true,
});

// Helper: create a payment intent for a sale
export async function createPaymentIntent(
  amountBDT: number,
  metadata: {
    invoice_number: string;
    patient_name?: string;
  }
) {
  // Stripe uses smallest currency unit — BDT paisa (1 BDT = 100 paisa)
  const amountInPaisa = Math.round(amountBDT * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInPaisa,
    currency: "bdt",
    metadata,
    automatic_payment_methods: { enabled: true },
  });

  return paymentIntent;
}

// Helper: verify Stripe webhook signature
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
) {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}
