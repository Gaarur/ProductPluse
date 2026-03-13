import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { changelogs, subscribers } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import { sendChangelogNotification } from "@/lib/resend";
import { z } from "zod";

const changelogSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(10),
  version: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
});

// GET /api/changelog?companyId=xxx
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    const publishedOnly = searchParams.get("published") === "true";
    if (!companyId) return NextResponse.json({ error: "companyId required" }, { status: 400 });

    const conditions = [eq(changelogs.companyId, companyId)];
    if (publishedOnly) conditions.push(eq(changelogs.isPublished, true));

    const items = await db.query.changelogs.findMany({
      where: and(...conditions),
      orderBy: [desc(changelogs.createdAt)],
    });

    return NextResponse.json({ changelogs: items });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/changelog — create changelog entry
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    if (!user.companyId) return NextResponse.json({ error: "No company" }, { status: 400 });

    const body = await req.json();
    const parsed = changelogSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const [entry] = await db.insert(changelogs).values({
      companyId: user.companyId,
      title: parsed.data.title,
      content: parsed.data.content,
      version: parsed.data.version,
      tags: parsed.data.tags,
      isPublished: parsed.data.isPublished || false,
      publishedAt: parsed.data.isPublished ? new Date() : null,
    }).returning();

    // Notify subscribers if publishing
    if (parsed.data.isPublished) {
      const subs = await db.query.subscribers.findMany({
        where: and(eq(subscribers.companyId, user.companyId), eq(subscribers.isActive, true)),
      });
      if (subs.length > 0) {
        const emails = subs.map(s => s.email);
        const changelogUrl = `${process.env.NEXT_PUBLIC_APP_URL}/changelog/${user.companyId}`;
        await sendChangelogNotification({
          to: emails,
          companyName: user.company?.name || "ProductPulse",
          title: parsed.data.title,
          summary: parsed.data.content.slice(0, 200),
          changelogUrl,
        }).catch(console.error);
      }
    }

    return NextResponse.json({ changelog: entry }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/changelog]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
