"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Users, Zap, Plus, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface AnalyticsItem {
  id: string;
  featureName: string;
  usageCount: number;
  dailyActiveUsers: number;
  retentionImpact: number;
}

interface Clusters {
  clusters: Array<{ theme: string; items: number[]; totalVotes: number; summary: string }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsItem[]>([]);
  const [summary, setSummary] = useState({ totalUsage: 0, avgDAU: 0, featureCount: 0 });
  const [loading, setLoading] = useState(true);
  const [clusters, setClusters] = useState<Clusters | null>(null);
  const [clusterLoading, setClusterLoading] = useState(false);
  const [addForm, setAddForm] = useState({ featureName: "", usageCount: 0, dailyActiveUsers: 0, retentionImpact: 0 });
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    fetch("/api/analytics").then(r => r.json()).then(d => {
      setAnalytics(d.analytics || []);
      setSummary(d.summary || {});
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleAddFeature = async () => {
    if (!addForm.featureName) return toast.error("Feature name required");
    setAddLoading(true);
    try {
      const res = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed");
      setAnalytics(prev => [...prev, data.entry]);
      setAddForm({ featureName: "", usageCount: 0, dailyActiveUsers: 0, retentionImpact: 0 });
      toast.success("Feature added!");
    } catch {
      toast.error("Failed to add feature");
    } finally {
      setAddLoading(false);
    }
  };

  const handleCluster = async () => {
    setClusterLoading(true);
    try {
      const res = await fetch("/api/ai/cluster-feedback", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setClusters(data);
      toast.success("Feedback clusters generated! ✨");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Clustering failed");
    } finally {
      setClusterLoading(false);
    }
  };

  const maxUsage = Math.max(...analytics.map(a => a.usageCount), 1);

  const statCards = [
    { label: "Total Usage Events", value: summary.totalUsage.toLocaleString(), icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Avg. Daily Active Users", value: summary.avgDAU.toLocaleString(), icon: Users, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Features Tracked", value: summary.featureCount, icon: BarChart3, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Feature Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Track feature adoption and usage across your product</p>
        </div>
        <Button onClick={handleCluster} disabled={clusterLoading} variant="outline" className="gap-2">
          {clusterLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-purple-500" />}
          AI Cluster Feedback
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardContent className="p-5">
                <div className={`inline-flex p-2 rounded-lg ${card.bg} mb-3`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div className="text-2xl font-bold text-foreground">{card.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{card.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Feature Analytics */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-4 h-4" /> Log Feature Data</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
            <div className="space-y-1.5 md:col-span-1">
              <Label>Feature Name</Label>
              <Input placeholder="Dark Mode" value={addForm.featureName}
                onChange={e => setAddForm({ ...addForm, featureName: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Usage Count</Label>
              <Input type="number" value={addForm.usageCount}
                onChange={e => setAddForm({ ...addForm, usageCount: +e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Daily Active Users</Label>
              <Input type="number" value={addForm.dailyActiveUsers}
                onChange={e => setAddForm({ ...addForm, dailyActiveUsers: +e.target.value })} />
            </div>
            <Button onClick={handleAddFeature} disabled={addLoading} className="gap-2">
              {addLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Feature"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feature List */}
      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : analytics.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No analytics tracked yet. Add your first feature above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Feature Adoption</h2>
          {analytics.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="hover:border-primary/30 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{item.featureName}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{item.dailyActiveUsers} DAU</span>
                      <Badge variant="outline" className="text-xs">
                        {item.retentionImpact}% retention impact
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Usage</span>
                      <span>{item.usageCount.toLocaleString()} events</span>
                    </div>
                    <Progress value={(item.usageCount / maxUsage) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* AI Cluster Results */}
      {clusters && clusters.clusters.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" /> AI Feedback Clusters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clusters.clusters.map((cluster, i) => (
              <Card key={i} className="border-purple-500/20 bg-purple-500/5">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{cluster.theme}</h3>
                    <Badge className="bg-purple-500/20 text-purple-400">{cluster.totalVotes} votes</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{cluster.summary}</p>
                  <p className="text-xs text-muted-foreground mt-2">{cluster.items.length} feedback items grouped</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
