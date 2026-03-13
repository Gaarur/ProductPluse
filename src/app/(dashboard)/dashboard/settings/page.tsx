"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings, Code2, CreditCard, Link, Copy, Check, Loader2, X, CheckCircle2, Circle } from "lucide-react";
import { PLANS } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const INTEGRATIONS = [
  {
    type: "github",
    name: "GitHub",
    description: "Import commits & PRs for AI changelog generation",
    icon: "🐙",
    placeholder: "https://api.github.com/repos/org/repo",
    label: "Repository URL",
  },
  {
    type: "slack",
    name: "Slack",
    description: "Get notified when new feedback is submitted",
    icon: "💬",
    placeholder: "https://hooks.slack.com/services/T.../B.../...",
    label: "Slack Webhook URL",
  },
  {
    type: "linear",
    name: "Linear",
    description: "Sync roadmap items with Linear issues",
    icon: "📐",
    placeholder: "lin_api_...",
    label: "Linear API Key",
  },
  {
    type: "jira",
    name: "Jira",
    description: "Connect Jira tickets to your roadmap",
    icon: "🟦",
    placeholder: "https://your-domain.atlassian.net",
    label: "Jira Domain URL",
  },
  {
    type: "zapier",
    name: "Zapier",
    description: "Connect ProductPulse to 5,000+ apps",
    icon: "⚡",
    placeholder: "https://hooks.zapier.com/hooks/catch/...",
    label: "Zapier Webhook URL",
  },
];

export default function SettingsPage() {
  const [copied, setCopied] = useState(false);
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ type: string; name: string; label: string; placeholder: string } | null>(null);
  const [configValue, setConfigValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const widgetScript = `<script src="${process.env.NEXT_PUBLIC_APP_URL || 'https://productpulse.app'}/widget.js" data-company="YOUR_COMPANY_ID"></script>`;

  const copyScript = () => {
    navigator.clipboard.writeText(widgetScript);
    setCopied(true);
    toast.success("Script copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchIntegrations = async () => {
    try {
      const res = await fetch("/api/integrations");
      const data = await res.json();
      const map: Record<string, boolean> = {};
      for (const item of data.integrations || []) {
        map[item.type] = item.isActive;
      }
      setConnected(map);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIntegrations(); }, []);

  const openConnectModal = (integration: typeof INTEGRATIONS[0]) => {
    setConfigValue("");
    setModal({ type: integration.type, name: integration.name, label: integration.label, placeholder: integration.placeholder });
  };

  const saveIntegration = async () => {
    if (!configValue.trim()) return toast.error("Please enter a value");
    setSaving(true);
    try {
      const res = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: modal!.type, config: { value: configValue } }),
      });
      if (!res.ok) throw new Error();
      toast.success(`${modal!.name} connected!`);
      setConnected(prev => ({ ...prev, [modal!.type]: true }));
      setModal(null);
    } catch {
      toast.error("Failed to connect");
    } finally {
      setSaving(false);
    }
  };

  const disconnect = async (type: string, name: string) => {
    setDisconnecting(type);
    try {
      const res = await fetch(`/api/integrations?type=${type}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success(`${name} disconnected`);
      setConnected(prev => ({ ...prev, [type]: false }));
    } catch {
      toast.error("Failed to disconnect");
    } finally {
      setDisconnecting(null);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Configure your workspace and integrations</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general" className="gap-2"><Settings className="w-4 h-4" /> General</TabsTrigger>
          <TabsTrigger value="widget" className="gap-2"><Code2 className="w-4 h-4" /> Widget</TabsTrigger>
          <TabsTrigger value="billing" className="gap-2"><CreditCard className="w-4 h-4" /> Billing</TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2"><Link className="w-4 h-4" /> Integrations</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Company Profile</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5"><Label>Company Name</Label><Input placeholder="Acme Corp" /></div>
              <div className="space-y-1.5"><Label>Website URL</Label><Input placeholder="https://acme.com" /></div>
              <div className="space-y-1.5"><Label>Description</Label><Input placeholder="What does your product do?" /></div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Danger Zone</CardTitle>
              <CardDescription>Irreversible and destructive actions</CardDescription>
            </CardHeader>
            <CardContent><Button variant="destructive" size="sm">Delete Workspace</Button></CardContent>
          </Card>
        </TabsContent>

        {/* Widget */}
        <TabsContent value="widget" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Embeddable Changelog Widget</CardTitle>
              <CardDescription>Add this snippet to show a &quot;What&apos;s New&quot; popup in your product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm text-muted-foreground relative">
                <pre className="whitespace-pre-wrap break-all">{widgetScript}</pre>
                <button onClick={copyScript} className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-background transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Placement guide:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Paste before the closing <code className="bg-muted px-1 py-0.5 rounded text-xs">&lt;/body&gt;</code> tag</li>
                  <li>Replace <code className="bg-muted px-1 py-0.5 rounded text-xs">YOUR_COMPANY_ID</code> with your actual company ID</li>
                  <li>Widget automatically shows latest 5 changelog entries</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(PLANS).filter(([key]) => key !== "free").map(([key, plan]) => (
              <Card key={key} className={key === "pro" ? "border-primary" : ""}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{plan.name}</h3>
                    {key === "pro" && <Badge className="text-xs bg-primary">Popular</Badge>}
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-3">
                    ${plan.price}<span className="text-base font-normal text-muted-foreground">/mo</span>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-5">
                    <li>✓ {plan.feedbackLimit === Infinity ? "Unlimited" : plan.feedbackLimit.toLocaleString()} feedback items</li>
                    <li>✓ {plan.memberLimit === Infinity ? "Unlimited" : plan.memberLimit} team members</li>
                    <li>✓ AI release notes & clustering</li>
                    <li>✓ Embeddable widget</li>
                    <li>✓ Email notifications</li>
                  </ul>
                  <Button
                    className="w-full"
                    variant={key === "pro" ? "default" : "outline"}
                    onClick={() => {
                      fetch("/api/stripe/checkout", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ plan: key }),
                      }).then(r => r.json()).then(d => { if (d.url) window.location.href = d.url; });
                    }}
                  >
                    Upgrade to {plan.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="mt-6">
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : (
              INTEGRATIONS.map(integration => {
                const isConnected = connected[integration.type];
                return (
                  <Card key={integration.type} className={isConnected ? "border-green-500/30" : ""}>
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{integration.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{integration.name}</p>
                            {isConnected && (
                              <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30 gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Connected
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{integration.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {isConnected ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive/30 hover:bg-destructive/10"
                            onClick={() => disconnect(integration.type, integration.name)}
                            disabled={disconnecting === integration.type}
                          >
                            {disconnecting === integration.type ? <Loader2 className="w-3 h-3 animate-spin" /> : "Disconnect"}
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => openConnectModal(integration)}>
                            Connect
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Connect Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card className="glass border-white/10">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Connect {modal.name}</CardTitle>
                  <button onClick={() => setModal(null)}><X className="w-4 h-4 text-muted-foreground" /></button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>{modal.label}</Label>
                    <Input
                      placeholder={modal.placeholder}
                      value={configValue}
                      onChange={e => setConfigValue(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && saveIntegration()}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={saveIntegration} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Connect"}
                    </Button>
                    <Button variant="outline" onClick={() => setModal(null)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

