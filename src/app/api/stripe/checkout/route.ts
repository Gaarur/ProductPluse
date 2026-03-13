import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { PLAN_PRICES } from "@/lib/stripe";
import { requireUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const { plan } = await req.json();
    const priceId = PLAN_PRICES[plan];
    if (!priceId) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { companyId: user.companyId!, plan },
      success_url: `${baseUrl}/dashboard/settings?billing=success`,
      cancel_url: `${baseUrl}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[POST /api/stripe/checkout]", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
