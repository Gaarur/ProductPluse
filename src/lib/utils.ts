import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(date);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export const PLANS = {
  free: { name: "Free", price: 0, feedbackLimit: 50, memberLimit: 2 },
  starter: { name: "Starter", price: 19, feedbackLimit: 500, memberLimit: 5 },
  growth: { name: "Growth", price: 49, feedbackLimit: 2000, memberLimit: 15 },
  pro: { name: "Pro", price: 99, feedbackLimit: 10000, memberLimit: 50 },
  enterprise: { name: "Enterprise", price: 199, feedbackLimit: Infinity, memberLimit: Infinity },
} as const;

export const STATUS_LABELS = {
  open: { label: "Open", color: "bg-blue-100 text-blue-700" },
  planned: { label: "Planned", color: "bg-purple-100 text-purple-700" },
  in_progress: { label: "In Progress", color: "bg-yellow-100 text-yellow-700" },
  completed: { label: "Completed", color: "bg-green-100 text-green-700" },
  declined: { label: "Declined", color: "bg-red-100 text-red-700" },
} as const;

export const ROADMAP_STATUS_LABELS = {
  planned: { label: "Planned", color: "bg-purple-100 text-purple-700" },
  in_progress: { label: "In Progress", color: "bg-yellow-100 text-yellow-700" },
  released: { label: "Released", color: "bg-green-100 text-green-700" },
} as const;
