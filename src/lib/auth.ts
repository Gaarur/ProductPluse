import { db } from "@/lib/db";
import { users, companies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function getCurrentUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkUser.id),
    with: { company: true },
  });

  return user;
}

export async function getCompanyBySlug(slug: string) {
  return db.query.companies.findFirst({
    where: eq(companies.slug, slug),
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireCompanyAccess(companyId: string) {
  const user = await requireUser();
  if (user.companyId !== companyId) throw new Error("Forbidden");
  return user;
}
