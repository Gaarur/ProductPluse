"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Zap, MessageSquare, Map, BookOpen, BarChart3, ArrowRight,
  ThumbsUp, ChevronUp, CheckCircle2, Circle, Clock, Sparkles,
  Users, TrendingUp, Filter,
} from "lucide-react";

// ─── Demo Data ───────────────────────────────────────────────

const FEEDBACK = [
  { id: 1, title: "Dark Mode Support", description: "It would be great to have a dark mode option across the entire app. My eyes hurt in the evening.", votes: 248, status: "in_progress", category: "UI/UX", author: "Sarah K.", voted: false },
  { id: 2, title: "Mobile App for iOS & Android", description: "A native mobile app would make it so easy to check feedback on the go and respond to comments.", votes: 193, status: "planned", category: "Platform", author: "James R.", voted: false },
  { id: 3, title: "Slack Integration", description: "Send notifications to our Slack channel whenever a new feature request is submitted.", votes: 177, status: "completed", category: "Integrations", author: "Emily T.", voted: true },
  { id: 4, title: "CSV Export for Feedback", description: "Allow admins to export the full feedback list as a CSV for reporting and offline analysis.", votes: 134, status: "open", category: "Data", author: "Marco A.", voted: false },
  { id: 5, title: "Custom Branding / White-label", description: "Let us customize the logo and colors so customers see our brand, not ProductPulse.", votes: 121, status: "open", category: "Customization", author: "Priya N.", voted: false },
  { id: 6, title: "Two-Factor Authentication", description: "2FA is a must-have for enterprise security compliance. Please add TOTP support.", votes: 98, status: "planned", category: "Security", author: "David L.", voted: false },
];

const ROADMAP = {
  planned: [
    { id: 1, title: "Mobile App", description: "Native iOS and Android apps for on-the-go access.", votes: 193, tag: "Platform" },
    { id: 2, title: "Two-Factor Authentication", description: "TOTP-based 2FA for enhanced account security.", votes: 98, tag: "Security" },
    { id: 3, title: "Custom Webhooks", description: "Send real-time events to any endpoint when things happen.", votes: 76, tag: "API" },
  ],
  in_progress: [
    { id: 4, title: "Dark Mode", description: "Full dark mode support across all pages and components.", votes: 248, tag: "UI/UX" },
    { id: 5, title: "AI Feedback Clustering", description: "Automatically group similar feature requests using AI.", votes: 88, tag: "AI" },
  ],
  released: [
    { id: 6, title: "Slack Integration", description: "Post notifications to Slack when new feedback is submitted.", votes: 177, tag: "Integrations" },
    { id: 7, title: "Email Notifications", description: "Notify subscribers when a new changelog is published.", votes: 112, tag: "Email" },
    { id: 8, title: "AI Release Notes", description: "Generate polished changelogs from raw git commits using GPT-4.", votes: 145, tag: "AI" },
  ],
};

const CHANGELOG = [
  {
    id: 1,
    version: "v2.4.0",
    title: "AI-Powered Release Notes & Slack Integration",
    date: "March 10, 2025",
    tags: ["AI", "Integrations"],
    content: `We're excited to ship two of our most-requested features this month!\n\n**AI Release Notes**\nStop manually writing changelogs. ProductPulse can now turn your raw git commits and pull request descriptions into polished, user-friendly release notes in under 10 seconds.\n\n**Slack Integration**\nConnect your workspace to Slack and get instant notifications whenever a new feature request is submitted. Never miss important user feedback again.`,
  },
  {
    id: 2,
    version: "v2.3.0",
    title: "Embeddable Widget & Analytics Dashboard",
    date: "February 20, 2025",
    tags: ["Widget", "Analytics"],
    content: `Two big additions that shipped this release:\n\n**Embeddable Changelog Widget**\nAdd a single script tag to your product and your users will see a beautiful "What's New" popup with your latest updates — no page navigation needed.\n\n**Analytics Dashboard**\nTrack feature adoption rates, daily active users per feature, and retention impact from a single view. Now you know which features are actually being used.`,
  },
  {
    id: 3,
    version: "v2.2.0",
    title: "Public Roadmap & Feedback Voting",
    date: "January 15, 2025",
    tags: ["Roadmap", "Feedback"],
    content: `This release focused on making your product more transparent:\n\n**Public Roadmap**\nShare a Kanban-style roadmap with your users so they always know what's Planned, In Progress, and Released. Build trust through transparency.\n\n**Improved Voting**\nUsers can now vote on multiple feedback items and unvote. Vote counts update in real-time. Top-voted items surface automatically.`,
  },
];

const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  planned: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  in_progress: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
};

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  planned: "Planned",
  in_progress: "In Progress",
  completed: "Completed",
};

// ─── Component ────────────────────────────────────────────────

export default function DemoPage() {
  const [tab, setTab] = useState<"feedback" | "roadmap" | "changelog">("feedback");
  const [votes, setVotes] = useState<Record<number, number>>(
    Object.fromEntries(FEEDBACK.map(f => [f.id, f.votes]))
  );
  const [voted, setVoted] = useState<Record<number, boolean>>(
    Object.fromEntries(FEEDBACK.map(f => [f.id, f.voted]))
  );
  const [filter, setFilter] = useState("all");

  const toggleVote = (id: number) => {
    setVoted(prev => {
      const isVoted = prev[id];
      setVotes(v => ({ ...v, [id]: v[id] + (isVoted ? -1 : 1) }));
      return { ...prev, [id]: !isVoted };
    });
  };

  const filteredFeedback = filter === "all"
    ? FEEDBACK
    : FEEDBACK.filter(f => f.status === filter);

  return (
    <div className="min-h-screen gradient-bg text-foreground">
      {/* Top bar */}
      <div className="border-b border-white/5 bg-primary/10 py-2 text-center text-sm text-primary font-medium">
        🎭 This is an interactive demo — changes are not saved. &nbsp;
        <Link href="/sign-up" className="underline underline-offset-2 hover:text-primary/80">
          Sign up free to get your workspace →
        </Link>
      </div>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 sticky top-0 z-40 backdrop-blur-md bg-background/60">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold">Acme Corp</span>
            <Badge className="text-xs ml-1 bg-white/5 text-muted-foreground border-white/10">Demo</Badge>
          </div>
          {/* Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-lg p-1">
            {([
              { key: "feedback", label: "Feedback", icon: MessageSquare },
              { key: "roadmap", label: "Roadmap", icon: Map },
              { key: "changelog", label: "Changelog", icon: BookOpen },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  tab === key
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>
        </div>
        <Link href="/sign-up">
          <Button size="sm" className="gap-1.5">
            Get Your Workspace <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </nav>

      {/* Mobile tabs */}
      <div className="flex md:hidden items-center gap-1 bg-white/5 m-3 rounded-lg p-1">
        {([
          { key: "feedback", label: "Feedback" },
          { key: "roadmap", label: "Roadmap" },
          { key: "changelog", label: "Changelog" },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${
              tab === key ? "bg-primary text-white" : "text-muted-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">

          {/* ── Feedback Board ── */}
          {tab === "feedback" && (
            <motion.div key="feedback" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Feature Requests</h1>
                  <p className="text-muted-foreground text-sm mt-0.5">Vote on features you want to see built</p>
                </div>
                <div className="flex gap-2">
                  {["all", "open", "planned", "in_progress", "completed"].map(s => (
                    <button
                      key={s}
                      onClick={() => setFilter(s)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all hidden sm:block ${
                        filter === s ? "bg-primary border-primary text-white" : "border-white/10 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {s === "all" ? "All" : STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredFeedback.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className={`glass border-white/8 hover:border-primary/30 transition-all ${voted[item.id] ? "border-primary/30" : ""}`}>
                      <CardContent className="p-4 flex items-start gap-4">
                        {/* Vote button */}
                        <button
                          onClick={() => toggleVote(item.id)}
                          className={`flex flex-col items-center gap-0.5 min-w-[52px] py-2 px-3 rounded-xl border transition-all ${
                            voted[item.id]
                              ? "bg-primary/20 border-primary/50 text-primary"
                              : "border-white/10 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                          }`}
                        >
                          <ChevronUp className="w-4 h-4" />
                          <span className="text-sm font-bold">{votes[item.id]}</span>
                        </button>
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground">{item.title}</h3>
                            <Badge className={`text-xs shrink-0 ${STATUS_COLORS[item.status]}`}>
                              {STATUS_LABELS[item.status]}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="bg-white/5 px-2 py-0.5 rounded">{item.category}</span>
                            <span>by {item.author}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Submit feedback CTA */}
              <Card className="glass border-dashed border-white/10 hover:border-primary/30 transition-all cursor-pointer group" onClick={() => {}}>
                <CardContent className="p-4 flex items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                  <div className="w-8 h-8 rounded-full border border-dashed border-white/20 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                    <span className="text-lg leading-none">+</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Submit a feature request</p>
                    <p className="text-xs opacity-60">Share your idea with the team</p>
                  </div>
                  <Link href="/sign-up" className="ml-auto" onClick={e => e.stopPropagation()}>
                    <Button size="sm" variant="outline" className="text-xs border-white/10">Sign up to post</Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ── Roadmap ── */}
          {tab === "roadmap" && (
            <motion.div key="roadmap" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">Product Roadmap</h1>
                <p className="text-muted-foreground text-sm mt-0.5">See what we're planning, building, and shipping</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {(["planned", "in_progress", "released"] as const).map((col) => {
                  const configs = {
                    planned: { label: "Planned", icon: Circle, color: "text-purple-400", dot: "bg-purple-400" },
                    in_progress: { label: "In Progress", icon: Clock, color: "text-yellow-400", dot: "bg-yellow-400" },
                    released: { label: "Released", icon: CheckCircle2, color: "text-green-400", dot: "bg-green-400" },
                  };
                  const { label, icon: Icon, color, dot } = configs[col];
                  return (
                    <div key={col} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${dot}`} />
                        <span className={`text-sm font-semibold ${color}`}>{label}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{ROADMAP[col].length}</span>
                      </div>
                      {ROADMAP[col].map((item, i) => (
                        <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                          <Card className="glass border-white/8 hover:border-primary/20 transition-all">
                            <CardContent className="p-4 space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-sm text-foreground">{item.title}</h3>
                                <Badge className="text-[10px] bg-white/5 text-muted-foreground border-white/10 shrink-0">{item.tag}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <ChevronUp className="w-3 h-3" />
                                <span>{item.votes} votes</span>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── Changelog ── */}
          {tab === "changelog" && (
            <motion.div key="changelog" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Changelog</h1>
                  <p className="text-muted-foreground text-sm mt-0.5">What we've shipped recently</p>
                </div>
                <Badge className="bg-primary/20 text-primary border-primary/30 gap-1.5">
                  <Sparkles className="w-3 h-3" /> AI-generated
                </Badge>
              </div>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-white/5 hidden md:block" />
                <div className="space-y-8">
                  {CHANGELOG.map((entry, i) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-6"
                    >
                      {/* Timeline dot */}
                      <div className="hidden md:flex flex-col items-center shrink-0">
                        <div className="w-6 h-6 rounded-full bg-primary/30 border border-primary/50 flex items-center justify-center mt-1">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                      </div>
                      {/* Content */}
                      <Card className="glass border-white/8 flex-1">
                        <CardContent className="p-5 space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className="bg-primary/20 text-primary border-primary/30 font-mono text-xs">{entry.version}</Badge>
                            {entry.tags.map(tag => (
                              <Badge key={tag} className="text-xs bg-white/5 text-muted-foreground border-white/10">{tag}</Badge>
                            ))}
                            <span className="text-xs text-muted-foreground ml-auto">{entry.date}</span>
                          </div>
                          <h2 className="text-lg font-bold text-foreground">{entry.title}</h2>
                          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                            {entry.content}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 backdrop-blur-xl bg-background/80 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">This is a demo workspace</p>
            <p className="text-xs text-muted-foreground">Create your own in 2 minutes — no credit card required</p>
          </div>
          <Link href="/sign-up">
            <Button className="gap-2 glow">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom padding for sticky bar */}
      <div className="h-20" />
    </div>
  );
}
