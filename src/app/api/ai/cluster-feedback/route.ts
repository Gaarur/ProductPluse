import { NextRequest, NextResponse } from "next/server";
import { clusterFeedback } from "@/lib/openai";
import { db } from "@/lib/db";
import { feedback } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth";

// POST /api/ai/cluster-feedback
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    if (!user.companyId) return NextResponse.json({ error: "No company" }, { status: 400 });

    const items = await db.query.feedback.findMany({
      where: eq(feedback.companyId, user.companyId),
      columns: { title: true, description: true, voteCount: true },
    });

    if (items.length < 3) {
      return NextResponse.json({ error: "Need at least 3 feedback items to cluster" }, { status: 400 });
    }

    const clusters = await clusterFeedback(items);
    return NextResponse.json(clusters);
  } catch (err) {
    console.error("[POST /api/ai/cluster-feedback]", err);
    return NextResponse.json({ error: "AI clustering failed" }, { status: 500 });
  }
}
