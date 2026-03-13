import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { companies, users, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { slugify } from "@/lib/utils";
import { sendWelcomeEmail } from "@/lib/resend";
import { z } from "zod";

const createCompanySchema = z.object({
  name: z.string().min(2).max(60),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().max(300).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = createCompanySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { name, websiteUrl, description } = parsed.data;

    // Generate unique slug
    let slug = slugify(name);
    const existing = await db.query.companies.findFirst({
      where: eq(companies.slug, slug),
    });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    // Create company
    const [company] = await db.insert(companies).values({
      name,
      slug,
      websiteUrl: websiteUrl || null,
      description: description || null,
    }).returning();

    // Upsert user
    const clerkUser = await import("@clerk/nextjs/server").then(m => m.currentUser());
    const [user] = await db.insert(users).values({
      clerkId: userId,
      email: clerkUser?.emailAddresses[0]?.emailAddress || "",
      name: clerkUser?.fullName || clerkUser?.firstName || "",
      avatarUrl: clerkUser?.imageUrl || null,
      companyId: company.id,
      role: "owner",
    }).onConflictDoUpdate({
      target: users.clerkId,
      set: { companyId: company.id, role: "owner" },
    }).returning();

    // Create free subscription
    await db.insert(subscriptions).values({
      companyId: company.id,
      plan: "free",
      status: "active",
    });

    // Send welcome email
    if (user.email) {
      await sendWelcomeEmail({ to: user.email, name: user.name || undefined }).catch(() => {});
    }

    return NextResponse.json({ company, user }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/companies]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
      with: { company: true },
    });

    if (!user?.company) return NextResponse.json({ company: null });
    return NextResponse.json({ company: user.company });
  } catch (err) {
    console.error("[GET /api/companies]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
