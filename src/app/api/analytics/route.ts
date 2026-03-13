import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { featureAnalytics } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import { z } from "zod";

const analyticsSchema = z.object({
  featureName: z.string().min(1).max(100),
  usageCount: z.number().int().min(0),
  dailyActiveUsers: z.number().int().min(0),
  retentionImpact: z.number().int().min(0).max(100),
});

// GET /api/analytics?companyId=xxx
export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    if (!user.companyId) return NextResponse.json({ error: "No company" }, { status: 400 });

    const items = await db.query.featureAnalytics.findMany({
      where: eq(featureAnalytics.companyId, user.companyId),
      orderBy: [desc(featureAnalytics.usageCount)],
    });

    // Summary stats
    const totalUsage = items.reduce((s, i) => s + i.usageCount, 0);
    const avgDAU = items.length
      ? Math.round(items.reduce((s, i) => s + i.dailyActiveUsers, 0) / items.length)
      : 0;

    return NextResponse.json({ analytics: items, summary: { totalUsage, avgDAU, featureCount: items.length } });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/analytics — log feature event
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    if (!user.companyId) return NextResponse.json({ error: "No company" }, { status: 400 });

    const body = await req.json();
    const parsed = analyticsSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const [entry] = await db.insert(featureAnalytics).values({
      companyId: user.companyId,
      ...parsed.data,
    }).returning();

    return NextResponse.json({ entry }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
