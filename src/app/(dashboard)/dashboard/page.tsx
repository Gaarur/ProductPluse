import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { feedback, changelogs, roadmapItems } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Map, BookOpen, BarChart3, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const companyId = user?.companyId!;

  const [feedbackCount, changelogCount, roadmapCount] = await Promise.all([
    db.select({ count: count() }).from(feedback).where(eq(feedback.companyId, companyId)),
    db.select({ count: count() }).from(changelogs).where(eq(changelogs.companyId, companyId)),
    db.select({ count: count() }).from(roadmapItems).where(eq(roadmapItems.companyId, companyId)),
  ]);

  const stats = [
    {
      title: "Total Feedback",
      value: feedbackCount[0]?.count ?? 0,
      icon: MessageSquare,
      href: "/dashboard/feedback",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Changelog Entries",
      value: changelogCount[0]?.count ?? 0,
      icon: BookOpen,
      href: "/dashboard/changelog",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Roadmap Items",
      value: roadmapCount[0]?.count ?? 0,
      icon: Map,
      href: "/dashboard/roadmap",
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Analytics",
      value: "Live",
      icon: BarChart3,
      href: "/dashboard/analytics",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  const quickActions = [
    { label: "Submit Feedback", href: "/dashboard/feedback", icon: MessageSquare },
    { label: "Publish Changelog", href: "/dashboard/changelog/new", icon: BookOpen },
    { label: "Add Roadmap Item", href: "/dashboard/roadmap", icon: Map },
    { label: "View Analytics", href: "/dashboard/analytics", icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.name?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your product communication hub.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${stat.bg}`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <TrendingUp className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.title}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} href={action.href}>
                <Card className="hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
                    <Icon className="w-6 h-6 text-primary" />
                    <span className="text-sm font-medium text-foreground">{action.label}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Plan Badge */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5 flex items-center justify-between">
          <div>
            <p className="font-semibold text-foreground">Your current plan</p>
            <p className="text-sm text-muted-foreground mt-1">
              Upgrade to unlock more features, seats, and higher limits.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="capitalize bg-primary text-white">{user?.company?.plan || "free"}</Badge>
            <Link
              href="/pricing"
              className="text-sm font-medium text-primary hover:underline"
            >
              Upgrade →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
