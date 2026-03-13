import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { roadmapItems } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import { z } from "zod";

const roadmapSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(["planned", "in_progress", "released"]).optional(),
  targetDate: z.string().optional(),
  feedbackId: z.string().uuid().optional(),
});

// GET /api/roadmap?companyId=xxx
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    if (!companyId) return NextResponse.json({ error: "companyId required" }, { status: 400 });

    const items = await db.query.roadmapItems.findMany({
      where: eq(roadmapItems.companyId, companyId),
      with: { linkedFeedback: { columns: { title: true, voteCount: true } } },
      orderBy: [asc(roadmapItems.sortOrder), asc(roadmapItems.createdAt)],
    });

    // Group by status
    const grouped = {
      planned: items.filter(i => i.status === "planned"),
      in_progress: items.filter(i => i.status === "in_progress"),
      released: items.filter(i => i.status === "released"),
    };

    return NextResponse.json({ roadmap: grouped, items });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/roadmap — create roadmap item
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    if (!user.companyId) return NextResponse.json({ error: "No company" }, { status: 400 });

    const body = await req.json();
    const parsed = roadmapSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const [item] = await db.insert(roadmapItems).values({
      companyId: user.companyId,
      title: parsed.data.title,
      description: parsed.data.description,
      status: parsed.data.status || "planned",
      targetDate: parsed.data.targetDate ? new Date(parsed.data.targetDate) : null,
      feedbackId: parsed.data.feedbackId || null,
    }).returning();

    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
