"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Zap, MessageSquare, Map, BookOpen, BarChart3, Sparkles,
  ArrowRight, Star, CheckCircle2, Globe, Code2,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Feedback Board",
    description: "Collect and prioritize user requests with a beautiful public board and voting system.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Map,
    title: "Public Roadmap",
    description: "Show customers what's coming with a transparent, auto-updating roadmap.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: BookOpen,
    title: "Changelog",
    description: "Publish beautiful release notes and notify subscribers automatically via email.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Sparkles,
    title: "AI Release Notes",
    description: "Transform raw commits and PRs into polished, user-friendly changelogs instantly.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Track feature adoption, daily active users, and retention impact from one dashboard.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: Code2,
    title: "Embeddable Widget",
    description: "Add a \"What's New\" widget to your product with a single script tag.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
];

const plans = [
  { name: "Starter", price: 19, features: ["500 feedback items", "5 team members", "AI features", "Email notifications"] },
  { name: "Growth", price: 49, popular: true, features: ["2,000 feedback items", "15 team members", "AI features", "Embeddable widget", "Priority support"] },
  { name: "Pro", price: 99, features: ["10,000 feedback items", "50 team members", "All AI features", "Custom domain", "API access"] },
  { name: "Enterprise", price: 199, features: ["Unlimited everything", "Unlimited members", "SSO / SAML", "SLA guarantee", "Dedicated support"] },
];

const stats = [
  { value: "10k+", label: "Companies" },
  { value: "2M+", label: "Feedback votes" },
  { value: "50k+", label: "Changelogs published" },
  { value: "99.9%", label: "Uptime" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen gradient-bg text-foreground">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5 sticky top-0 z-40 backdrop-blur-md bg-background/60">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">ProductPulse AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <Link href="/demo" className="hover:text-foreground transition-colors text-primary font-medium">Demo</Link>
          <Link href="/sign-in" className="hover:text-foreground transition-colors">Sign In</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm" className="gap-1.5">
              Start Free <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-20 pb-0 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto space-y-6"
        >
          {/* Label */}
          <Badge className="bg-primary/20 text-primary border-primary/30 gap-1.5 px-4 py-1.5">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Product Communication
          </Badge>

          {/* Main headline — what does it do? */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
            Manage feedback,{" "}
            <span className="gradient-text">roadmap & changelog</span>{" "}
            in one place.
          </h1>

          {/* Subheadline — who is it for + why useful */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            SaaS teams use ProductPulse to collect feature requests, prioritize ideas with voting,
            and share updates with users — automatically powered by AI.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <Link href="/sign-up">
              <Button size="lg" className="gap-2 px-8 text-base h-12 glow font-semibold">
                Start Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="gap-2 px-8 text-base h-12 border-white/10">
                <Globe className="w-4 h-4" /> View Demo
              </Button>
            </Link>
          </div>

          {/* Trust chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground pt-1">
            {["No credit card required", "Free plan forever", "2-minute setup", "Multi-tenant"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Dashboard screenshot */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative mt-16 max-w-6xl mx-auto"
        >
          {/* Fade to bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
          {/* Screenshot frame */}
          <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-primary/10 glow">
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs text-muted-foreground font-mono">app.productpulse.ai/dashboard</span>
            </div>
            <img
              src="/dashboard-preview.png"
              alt="ProductPulse AI Dashboard — Feedback board, roadmap, and changelog in one view"
              className="w-full object-cover"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-extrabold gradient-text">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold">Everything you need</h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Replace 4 tools with one. ProductPulse handles it all.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <Card className="glass border-white/8 hover:border-primary/30 transition-all h-full group">
                  <CardContent className="p-6">
                    <div className={`inline-flex p-2.5 rounded-xl ${feature.bg} mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 ${feature.color}`} />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold">Simple, transparent pricing</h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <Card className={`relative h-full ${plan.popular ? "border-primary glow" : "border-white/8"} glass`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-white px-3 gap-1">
                      <Star className="w-3 h-3" /> Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6 flex flex-col h-full">
                  <h3 className="font-bold text-lg text-foreground">{plan.name}</h3>
                  <div className="text-4xl font-extrabold text-foreground my-4">
                    ${plan.price}
                    <span className="text-base font-normal text-muted-foreground">/mo</span>
                  </div>
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/sign-up">
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <h2 className="text-4xl font-bold">
            Ready to build in public?
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of SaaS teams using ProductPulse to communicate product changes beautifully.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="gap-2 px-8 text-base h-12 glow">
                Start for free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="gap-2 px-8 text-base h-12 border-white/10">
                <Globe className="w-4 h-4" /> View Demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">ProductPulse</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 ProductPulse. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
