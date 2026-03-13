import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { subscriptions, companies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const companyId = session.metadata?.companyId;
        const plan = session.metadata?.plan as "starter" | "growth" | "pro" | "enterprise";
        if (!companyId || !plan) break;

        await db.update(subscriptions).set({
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          plan,
          status: "active",
          updatedAt: new Date(),
        }).where(eq(subscriptions.companyId, companyId));

        await db.update(companies).set({ plan }).where(eq(companies.id, companyId));
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const priceId = sub.items.data[0]?.price.id;
        const planMap: Record<string, string> = {
          [process.env.STRIPE_STARTER_PRICE_ID!]: "starter",
          [process.env.STRIPE_GROWTH_PRICE_ID!]: "growth",
          [process.env.STRIPE_PRO_PRICE_ID!]: "pro",
          [process.env.STRIPE_ENTERPRISE_PRICE_ID!]: "enterprise",
        };
        const plan = planMap[priceId] || "free";

        const existing = await db.query.subscriptions.findFirst({
          where: eq(subscriptions.stripeSubscriptionId, sub.id),
        });
        if (existing) {
          await db.update(subscriptions).set({
            plan: plan as any,
            status: sub.status as any,
            currentPeriodEnd: new Date((sub as any).current_period_end * 1000),
            cancelAtPeriodEnd: (sub as any).cancel_at_period_end,
            updatedAt: new Date(),
          }).where(eq(subscriptions.id, existing.id));

          await db.update(companies)
            .set({ plan: plan as any })
            .where(eq(companies.id, existing.companyId));
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const existing = await db.query.subscriptions.findFirst({
          where: eq(subscriptions.stripeSubscriptionId, sub.id),
        });
        if (existing) {
          await db.update(subscriptions).set({ plan: "free", status: "canceled", updatedAt: new Date() })
            .where(eq(subscriptions.id, existing.id));
          await db.update(companies).set({ plan: "free" }).where(eq(companies.id, existing.companyId));
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Stripe webhook]", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
