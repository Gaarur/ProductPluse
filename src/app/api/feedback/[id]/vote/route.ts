import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { feedback, votes } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { requireUser } from "@/lib/auth";

// POST /api/feedback/[id]/vote — toggle vote
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireUser();

    // Check existing vote
    const existingVote = await db.query.votes.findFirst({
      where: and(eq(votes.feedbackId, id), eq(votes.userId, user.id)),
    });

    if (existingVote) {
      // Remove vote
      await db.delete(votes).where(eq(votes.id, existingVote.id));
      await db.update(feedback)
        .set({ voteCount: sql`${feedback.voteCount} - 1` })
        .where(eq(feedback.id, id));
      return NextResponse.json({ voted: false });
    } else {
      // Add vote
      await db.insert(votes).values({ feedbackId: id, userId: user.id });
      await db.update(feedback)
        .set({ voteCount: sql`${feedback.voteCount} + 1` })
        .where(eq(feedback.id, id));
      return NextResponse.json({ voted: true });
    }
  } catch (err) {
    console.error("[POST /api/feedback/[id]/vote]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
