import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscribers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email(),
  companyId: z.string().uuid(),
});

// POST /api/widget/subscribe — subscribe to changelog updates
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = subscribeSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

    await db.insert(subscribers).values({
      companyId: parsed.data.companyId,
      email: parsed.data.email,
      isActive: true,
    }).onConflictDoUpdate({
      target: [subscribers.companyId, subscribers.email],
      set: { isActive: true },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
