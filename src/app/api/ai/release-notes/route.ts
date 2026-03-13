import { NextRequest, NextResponse } from "next/server";
import { generateReleaseNotes, clusterFeedback } from "@/lib/openai";
import { db } from "@/lib/db";
import { feedback } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import { z } from "zod";

const releaseNotesSchema = z.object({
  commits: z.array(z.string()).optional(),
  prTitles: z.array(z.string()).optional(),
  manualNotes: z.string().optional(),
  productName: z.string().optional(),
});

// POST /api/ai/release-notes
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const parsed = releaseNotesSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const notes = await generateReleaseNotes({
      ...parsed.data,
      productName: parsed.data.productName || user.company?.name,
    });

    return NextResponse.json({ releaseNotes: notes });
  } catch (err) {
    console.error("[POST /api/ai/release-notes]", err);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
