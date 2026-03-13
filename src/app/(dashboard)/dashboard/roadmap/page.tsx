"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2, Target, GitBranch, CheckCircle2 } from "lucide-react";
import { ROADMAP_STATUS_LABELS, formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface RoadmapItem {
  id: string;
  title: string;
  description?: string | null;
  status: "planned" | "in_progress" | "released";
  voteCount: number;
  targetDate?: string | null;
}

interface RoadmapData {
  planned: RoadmapItem[];
  in_progress: RoadmapItem[];
  released: RoadmapItem[];
}

const COLUMNS = [
  { key: "planned", label: "Planned", icon: Target, color: "text-purple-500" },
  { key: "in_progress", label: "In Progress", icon: GitBranch, color: "text-yellow-500" },
  { key: "released", label: "Released", icon: CheckCircle2, color: "text-green-500" },
] as const;

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<RoadmapData>({ planned: [], in_progress: [], released: [] });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [companyId, setCompanyId] = useState<string>("");
  const [form, setForm] = useState({ title: "", description: "", status: "planned", targetDate: "" });

  useEffect(() => {
    fetch("/api/companies").then(r => r.json()).then(d => {
      if (d.company?.id) {
        setCompanyId(d.company.id);
        return fetch(`/api/roadmap?companyId=${d.company.id}`);
      }
    }).then(r => r?.json()).then(d => {
      if (d?.roadmap) setRoadmap(d.roadmap);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setRoadmap(prev => ({
        ...prev,
        [form.status]: [...prev[form.status as keyof RoadmapData], data.item],
      }));
      toast.success("Roadmap item added!");
      setOpen(false);
      setForm({ title: "", description: "", status: "planned", targetDate: "" });
    } catch {
      toast.error("Failed to add roadmap item");
    } finally {
      setSubmitting(false);
    }
  };

  const statusLabel = ROADMAP_STATUS_LABELS as Record<string, { label: string; color: string }>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Product Roadmap</h1>
          <p className="text-muted-foreground text-sm mt-1">Track what&apos;s planned, in progress, and shipped</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <Button className="gap-2" onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4" /> Add Item
          </Button>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Roadmap Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label>Title *</Label>
                <Input
                  placeholder="Feature or milestone name..."
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  placeholder="More details..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v => setForm({ ...form, status: v || "planned" })}>
                    <SelectTrigger><SelectValue placeholder="Planned" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="released">Released</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Target Date</Label>
                  <Input
                    type="date"
                    value={form.targetDate}
                    onChange={e => setForm({ ...form, targetDate: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add to Roadmap"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((col) => {
            const Icon = col.icon;
            const items = roadmap[col.key];
            return (
              <div key={col.key} className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <Icon className={`w-4 h-4 ${col.color}`} />
                  <h2 className="font-semibold text-foreground">{col.label}</h2>
                  <Badge variant="secondary" className="ml-auto text-xs">{items.length}</Badge>
                </div>
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8 border border-dashed border-border rounded-lg">
                    Nothing here yet
                  </p>
                ) : (
                  items.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="hover:border-primary/30 transition-colors">
                        <CardContent className="p-4">
                          <h3 className="font-medium text-foreground text-sm leading-snug">{item.title}</h3>
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                          )}
                          {item.targetDate && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Target: {formatDate(item.targetDate)}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
