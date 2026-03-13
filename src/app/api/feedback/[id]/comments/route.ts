import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import { z } from "zod";

const commentSchema = z.object({
  content: z.string().min(1).max(2000),
  isInternal: z.boolean().optional(),
});

// GET /api/feedback/[id]/comments
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const items = await db.query.comments.findMany({
      where: eq(comments.feedbackId, id),
      with: { user: { columns: { name: true, avatarUrl: true } } },
      orderBy: [asc(comments.createdAt)],
    });
    return NextResponse.json({ comments: items });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/feedback/[id]/comments
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireUser();
    const body = await req.json();
    const parsed = commentSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const [comment] = await db.insert(comments).values({
      feedbackId: id,
      userId: user.id,
      content: parsed.data.content,
      isInternal: parsed.data.isInternal || false,
    }).returning();

    return NextResponse.json({ comment }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
