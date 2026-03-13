"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowUp, MessageSquare, Plus, Filter, Clock, TrendingUp, Loader2, X
} from "lucide-react";
import { STATUS_LABELS, formatRelativeTime } from "@/lib/utils";
import { toast } from "sonner";

interface FeedbackItem {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  voteCount: number;
  category?: string | null;
  createdAt: string;
  createdByUser?: { name: string | null; avatarUrl: string | null } | null;
}

interface FeedbackPageProps {
  companyId: string;
}

// Main feedback board component (can be used in both dashboard and public)
export default function FeedbackBoard({ companyId }: FeedbackPageProps) {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("votes");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "" });

  const fetchFeedback = async () => {
    const params = new URLSearchParams({ companyId, sort });
    if (statusFilter !== "all") params.set("status", statusFilter);
    const res = await fetch(`/api/feedback?${params}`);
    const data = await res.json();
    setItems(data.feedback || []);
    setLoading(false);
  };

  useEffect(() => { fetchFeedback(); }, [sort, statusFilter]);

  const handleVote = async (id: string) => {
    const res = await fetch(`/api/feedback/${id}/vote`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setItems(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, voteCount: data.voted ? item.voteCount + 1 : item.voteCount - 1 }
            : item
        )
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");
    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to submit");
      toast.success("Feedback submitted!");
      setShowForm(false);
      setForm({ title: "", description: "", category: "" });
      fetchFeedback();
    } catch {
      toast.error("Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const statusLabel = STATUS_LABELS as Record<string, { label: string; color: string }>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Feedback Board</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {items.length} requests · Sorted by {sort}
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Submit Feedback
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v || "all")}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button
            variant={sort === "votes" ? "default" : "outline"}
            size="sm"
            onClick={() => setSort("votes")}
            className="gap-1 h-9"
          >
            <TrendingUp className="w-3.5 h-3.5" /> Top
          </Button>
          <Button
            variant={sort === "newest" ? "default" : "outline"}
            size="sm"
            onClick={() => setSort("newest")}
            className="gap-1 h-9"
          >
            <Clock className="w-3.5 h-3.5" /> Newest
          </Button>
        </div>
      </div>

      {/* Submit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card className="glass border-white/10">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Submit Feedback</CardTitle>
                  <button onClick={() => setShowForm(false)}>
                    <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                  </button>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>Title *</Label>
                      <Input
                        placeholder="Short description of your request..."
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Details</Label>
                      <Textarea
                        placeholder="More context about your request..."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Category</Label>
                      <Input
                        placeholder="e.g. UI, Performance, Feature"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Feedback"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No feedback yet</p>
          <p className="text-sm">Be the first to submit a feature request!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => {
            const statusConfig = statusLabel[item.status];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="hover:border-primary/30 transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Vote Button */}
                      <button
                        onClick={() => handleVote(item.id)}
                        className="flex flex-col items-center gap-1 min-w-[48px] p-2 rounded-lg hover:bg-primary/10 transition-colors group"
                      >
                        <ArrowUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-sm font-bold text-foreground">{item.voteCount}</span>
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-foreground leading-tight">{item.title}</h3>
                          {statusConfig && (
                            <Badge className={`text-xs shrink-0 ${statusConfig.color}`}>
                              {statusConfig.label}
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                          {item.category && (
                            <Badge variant="outline" className="text-xs">{item.category}</Badge>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatRelativeTime(item.createdAt)}
                          </span>
                          {item.createdByUser?.name && (
                            <span>by {item.createdByUser.name}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
