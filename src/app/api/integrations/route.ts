import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { integrations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { requireUser } from "@/lib/auth";

// GET /api/integrations — list integrations for company
export async function GET() {
  try {
    const user = await requireUser();
    if (!user.companyId) return NextResponse.json({ integrations: [] });

    const items = await db.query.integrations.findMany({
      where: eq(integrations.companyId, user.companyId),
    });

    return NextResponse.json({ integrations: items });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// POST /api/integrations — connect / update an integration
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    if (!user.companyId) return NextResponse.json({ error: "No company" }, { status: 400 });

    const { type, config } = await req.json();
    if (!type) return NextResponse.json({ error: "type is required" }, { status: 400 });

    const configStr = typeof config === "object" ? JSON.stringify(config) : config;

    const existing = await db.query.integrations.findFirst({
      where: and(eq(integrations.companyId, user.companyId), eq(integrations.type, type)),
    });

    if (existing) {
      await db.update(integrations)
        .set({ config: configStr, isActive: true, updatedAt: new Date() })
        .where(eq(integrations.id, existing.id));
    } else {
      await db.insert(integrations).values({
        companyId: user.companyId,
        type,
        config: configStr,
        isActive: true,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/integrations?type=slack — disconnect
export async function DELETE(req: NextRequest) {
  try {
    const user = await requireUser();
    if (!user.companyId) return NextResponse.json({ error: "No company" }, { status: 400 });

    const type = new URL(req.url).searchParams.get("type");
    if (!type) return NextResponse.json({ error: "type is required" }, { status: 400 });

    await db.delete(integrations).where(
      and(eq(integrations.companyId, user.companyId), eq(integrations.type, type))
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
