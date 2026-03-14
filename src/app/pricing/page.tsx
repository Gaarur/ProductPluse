"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, ArrowRight, Star, CheckCircle2, HelpCircle } from "lucide-react";

const plans = [
  { 
    name: "Starter", 
    price: 19, 
    features: ["500 feedback items", "5 team members", "AI features", "Email notifications"] 
  },
  { 
    name: "Growth", 
    price: 49, 
    popular: true, 
    features: ["2,000 feedback items", "15 team members", "AI features", "Embeddable widget", "Priority support"] 
  },
  { 
    name: "Pro", 
    price: 99, 
    features: ["10,000 feedback items", "50 team members", "All AI features", "Custom domain", "API access"] 
  },
  { 
    name: "Enterprise", 
    price: 199, 
    features: ["Unlimited everything", "Unlimited members", "SSO / SAML", "SLA guarantee", "Dedicated support"] 
  },
];

const faqs = [
  {
    q: "Can I cancel at any time?",
    a: "Yes! There are no long-term contracts. You can cancel your subscription at any time from your dashboard."
  },
  {
    q: "Do I need a credit card to sign up?",
    a: "No, you can start building on our free tier without a credit card. We only ask for payment when you're ready to upgrade."
  },
  {
    q: "What counts as a 'feedback item'?",
    a: "A feedback item is any unique feature request, bug report, or idea submitted by a user on your public or private boards."
  },
  {
    q: "Can I switch plans later?",
    a: "Absolutely. You can upgrade or downgrade your plan at any time. Your prorated balance will be applied automatically."
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen gradient-bg text-foreground flex flex-col">
      {/* Navbar Minimal */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5 sticky top-0 z-40 backdrop-blur-md bg-background/60">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg hidden sm:inline-block">ProductPulse AI</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm" className="gap-1.5 glow">
              Start Free <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center pt-24 pb-16 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto space-y-6 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your product. Connect with your users, gather feedback, and ship better updates.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
            >
              <Card className={`relative h-full flex flex-col glass ${plan.popular ? "border-primary shadow-xl shadow-primary/20 glow" : "border-white/10"}`}>
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary hover:bg-primary/90 text-white px-3 py-1 gap-1 text-xs">
                      <Star className="w-3.5 h-3.5" /> Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8 flex flex-col flex-1">
                  <h3 className="font-bold text-xl text-foreground mb-2">{plan.name}</h3>
                  <div className="text-5xl font-extrabold tracking-tight text-foreground my-4 flex items-end">
                    ${plan.price}
                    <span className="text-lg font-medium text-muted-foreground ml-1 mb-1">/mo</span>
                  </div>
                  <ul className="space-y-4 my-8 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-3 text-muted-foreground font-medium">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/sign-up" className="w-full mt-auto">
                    <Button
                      size="lg"
                      className="w-full text-base font-semibold"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Choose {plan.name}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 max-w-4xl w-full text-left"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, i) => (
              <div key={i} className="space-y-3">
                <h4 className="flex items-center gap-2 font-semibold text-lg">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  {faq.q}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Still not sure?</h2>
          <Link href="/sign-up">
            <Button size="lg" variant="secondary" className="px-8 font-semibold">
              Start your free test run today
            </Button>
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-muted-foreground text-sm px-6">
          <p>© 2026 ProductPulse AI. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/demo" className="hover:text-foreground transition-colors">Demo</Link>
            <Link href="/sign-up" className="hover:text-foreground transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
