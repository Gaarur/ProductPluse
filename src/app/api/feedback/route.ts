import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { feedback, votes, users } from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { z } from "zod";
import { requireUser } from "@/lib/auth";

const createFeedbackSchema = z.object({
  title: z.string().min(5).max(150),
  description: z.string().max(2000).optional(),
  category: z.string().optional(),
});

// GET /api/feedback?companyId=xxx&status=open&sort=votes
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    const status = searchParams.get("status");
    const sort = searchParams.get("sort") || "votes";

    if (!companyId) return NextResponse.json({ error: "companyId required" }, { status: 400 });

    const conditions = [
      eq(feedback.companyId, companyId),
      eq(feedback.isPublic, true),
    ];
    if (status) conditions.push(eq(feedback.status, status as typeof feedback.status._.data));

    const items = await db.query.feedback.findMany({
      where: and(...conditions),
      with: { createdByUser: { columns: { name: true, avatarUrl: true } } },
      orderBy: sort === "votes"
        ? [desc(feedback.voteCount), desc(feedback.createdAt)]
        : [desc(feedback.createdAt)],
    });

    return NextResponse.json({ feedback: items });
  } catch (err) {
    console.error("[GET /api/feedback]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/feedback — submit new feedback
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    if (!user.companyId) return NextResponse.json({ error: "No company" }, { status: 400 });

    const body = await req.json();
    const parsed = createFeedbackSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const [item] = await db.insert(feedback).values({
      companyId: user.companyId,
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      createdBy: user.id,
    }).returning();

    return NextResponse.json({ feedback: item }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/feedback]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
