import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as any,
  typescript: true,
});

export const PLAN_PRICES: Record<string, string> = {
  starter: process.env.STRIPE_STARTER_PRICE_ID!,
  growth: process.env.STRIPE_GROWTH_PRICE_ID!,
  pro: process.env.STRIPE_PRO_PRICE_ID!,
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
};

export async function createCheckoutSession({
  companyId,
  plan,
  email,
  returnUrl,
}: {
  companyId: string;
  plan: string;
  email: string;
  returnUrl: string;
}) {
  const priceId = PLAN_PRICES[plan];
  if (!priceId) throw new Error("Invalid plan");

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { companyId, plan },
    success_url: `${returnUrl}/dashboard/settings/billing?success=true`,
    cancel_url: `${returnUrl}/pricing?canceled=true`,
  });

  return session;
}

export async function createBillingPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${returnUrl}/dashboard/settings/billing`,
  });
  return session;
}
