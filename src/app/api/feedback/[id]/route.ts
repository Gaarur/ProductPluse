import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { feedback } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["open", "planned", "in_progress", "completed", "declined"]).optional(),
  title: z.string().min(5).max(150).optional(),
  description: z.string().max(2000).optional(),
});

// PATCH /api/feedback/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireUser();
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const [updated] = await db.update(feedback)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(feedback.id, id))
      .returning();

    return NextResponse.json({ feedback: updated });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/feedback/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireUser();
    await db.delete(feedback).where(eq(feedback.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
