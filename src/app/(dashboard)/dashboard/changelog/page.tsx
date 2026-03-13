"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Loader2, Sparkles, BookOpen, Send, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface ChangelogEntry {
  id: string;
  title: string;
  content: string;
  version?: string | null;
  tags?: string[] | null;
  isPublished: boolean;
  publishedAt?: string | null;
  aiGenerated: boolean;
  createdAt: string;
}

export default function ChangelogPage() {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState("");
  const [tab, setTab] = useState("list");
  const [form, setForm] = useState({
    title: "", content: "", version: "", tags: "", isPublished: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInput, setAiInput] = useState({ manualNotes: "", commits: "" });

  useEffect(() => {
    fetch("/api/companies").then(r => r.json()).then(d => {
      if (d.company?.id) {
        setCompanyId(d.company.id);
        return fetch(`/api/changelog?companyId=${d.company.id}`);
      }
    }).then(r => r?.json()).then(d => {
      if (d?.changelogs) setEntries(d.changelogs);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (publish: boolean) => {
    if (!form.title || !form.content) return toast.error("Title and content required");
    setSubmitting(true);
    try {
      const res = await fetch("/api/changelog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags ? form.tags.split(",").map(t => t.trim()) : [],
          isPublished: publish,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      setEntries(prev => [data.changelog, ...prev]);
      setForm({ title: "", content: "", version: "", tags: "", isPublished: false });
      setTab("list");
      toast.success(publish ? "Changelog published! Subscribers notified 📨" : "Draft saved");
    } catch {
      toast.error("Failed to save changelog");
    } finally {
      setSubmitting(false);
    }
  };

  const generateWithAI = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/release-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manualNotes: aiInput.manualNotes,
          commits: aiInput.commits ? aiInput.commits.split("\n").filter(Boolean) : [],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm(f => ({ ...f, content: data.releaseNotes }));
      setTab("editor");
      toast.success("AI generated release notes! ✨");
    } catch {
      toast.error("AI generation failed");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Changelog</h1>
          <p className="text-muted-foreground text-sm mt-1">{entries.length} entries · Manage your product updates</p>
        </div>
        <Button onClick={() => setTab("editor")} className="gap-2">
          <Plus className="w-4 h-4" /> New Entry
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="list" className="gap-2"><BookOpen className="w-4 h-4" /> Entries</TabsTrigger>
          <TabsTrigger value="editor" className="gap-2"><Send className="w-4 h-4" /> Write</TabsTrigger>
          <TabsTrigger value="ai" className="gap-2"><Sparkles className="w-4 h-4" /> AI Generate</TabsTrigger>
        </TabsList>

        {/* List */}
        <TabsContent value="list" className="mt-6">
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : entries.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No changelog entries yet</p>
              <Button className="mt-4 gap-2" onClick={() => setTab("editor")}>
                <Plus className="w-4 h-4" /> Create your first entry
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="hover:border-primary/30 transition-colors">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground">{entry.title}</h3>
                            {entry.version && (
                              <Badge variant="outline" className="text-xs font-mono">v{entry.version}</Badge>
                            )}
                            {entry.aiGenerated && (
                              <Badge className="text-xs bg-purple-500/20 text-purple-400 gap-1">
                                <Sparkles className="w-3 h-3" /> AI
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{entry.content}</p>
                          {entry.tags && entry.tags.length > 0 && (
                            <div className="flex gap-1.5 mt-2 flex-wrap">
                              {entry.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={entry.isPublished ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}>
                            {entry.isPublished ? "Published" : "Draft"}
                          </Badge>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDate(entry.createdAt)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Editor */}
        <TabsContent value="editor" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Write Changelog Entry</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Title *</Label>
                  <Input
                    placeholder="What changed?"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Version</Label>
                  <Input
                    placeholder="e.g. 2.1.0"
                    value={form.version}
                    onChange={e => setForm({ ...form, version: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Content * (Markdown supported)</Label>
                <Textarea
                  placeholder="Describe what changed, why it matters, and how to use it..."
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  rows={10}
                  className="font-mono text-sm resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Tags (comma-separated)</Label>
                <Input
                  placeholder="bug-fix, feature, improvement"
                  value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => handleSubmit(false)} disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Draft"}
                </Button>
                <Button onClick={() => handleSubmit(true)} disabled={submitting} className="gap-2">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Publish & Notify</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Generate */}
        <TabsContent value="ai" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" /> AI Release Notes Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Git Commits (one per line)</Label>
                <Textarea
                  placeholder={"fix: resolve login timeout issue\nfeat: add dark mode toggle\nchore: upgrade dependencies"}
                  value={aiInput.commits}
                  onChange={e => setAiInput({ ...aiInput, commits: e.target.value })}
                  rows={5}
                  className="font-mono text-sm resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Manual Notes</Label>
                <Textarea
                  placeholder="Any extra context for the AI to include..."
                  value={aiInput.manualNotes}
                  onChange={e => setAiInput({ ...aiInput, manualNotes: e.target.value })}
                  rows={3}
                  className="resize-none"
                />
              </div>
              <Button onClick={generateWithAI} disabled={aiLoading} className="gap-2 w-full">
                {aiLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Generate with AI</>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                AI will generate clean, user-friendly release notes. You can edit them before publishing.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
