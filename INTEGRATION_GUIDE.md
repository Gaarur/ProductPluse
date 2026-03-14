# 🚀 ProductPulse AI — Integration & Usage Guide

This guide walks you through everything you need to start collecting feedback, sharing your roadmap, and keeping your users in the loop — all powered by ProductPulse AI.

---

## Table of Contents

1. [Quick Start — Onboarding](#1-quick-start--onboarding)
2. [Your Company Dashboard](#2-your-company-dashboard)
3. [Collecting User Feedback](#3-collecting-user-feedback)
4. [Public Roadmap](#4-public-roadmap)
5. [Changelog & Release Notes](#5-changelog--release-notes)
6. [Embeddable "What's New" Widget](#6-embeddable-whats-new-widget)
7. [AI Features](#7-ai-features)
8. [Analytics](#8-analytics)
9. [Email Notifications](#9-email-notifications)
10. [API Reference](#10-api-reference)
11. [Billing & Plans](#11-billing--plans)
12. [Tips & Best Practices](#12-tips--best-practices)

---

## 1. Quick Start — Onboarding

After signing up at **ProductPulse AI**, you'll be guided through a short onboarding flow:

1. **Create your Company Workspace** — Enter your company name and choose a unique slug (e.g., `acme-corp`). This slug powers all your public-facing URLs.
2. **Invite your team** — Add teammates from **Dashboard → Settings → Team**.
3. **Connect your services** — Follow the [Setup Guide](./SETUP_GUIDE.md) to connect your database, auth, payments, and email providers.
4. **Embed the widget** — (Optional) Drop the changelog widget into your own product in under 2 minutes (see [Section 6](#6-embeddable-whats-new-widget)).

> **Your unique company slug** is used throughout. Replace `[your-slug]` in the examples below with your actual slug.

---

## 2. Your Company Dashboard

Once logged in, navigate to **Dashboard** to access all management features:

| Section | What You Can Do |
|---|---|
| **Feedback** | View, filter, merge, and respond to user-submitted requests |
| **Roadmap** | Drag & drop items across Planned / In Progress / Released columns |
| **Changelog** | Draft, AI-generate, and publish release notes |
| **Analytics** | See vote trends, top-requested features, and engagement stats |
| **Settings** | Manage company profile, widget config, and team members |

---

## 3. Collecting User Feedback

### Option A — Share the Public Feedback Board

Share this link anywhere — in your app's nav, footer, help docs, or onboarding emails:

```
https://productpulse.app/feedback/[your-slug]
```

Users can:
- **Submit** new feature requests
- **Upvote** existing ideas
- **Track status** (Open → Planned → In Progress → Released)

### Option B — Embed via API (Custom UI)

If you want to collect feedback inside your own UI, `POST` directly to the API:

```http
POST /api/feedback
Content-Type: application/json

{
  "companyId": "YOUR_COMPANY_ID",
  "title": "Dark mode support",
  "description": "Would love a dark mode for the dashboard.",
  "authorEmail": "user@example.com"
}
```

**Response:**

```json
{
  "id": "fb_01abc...",
  "title": "Dark mode support",
  "status": "open",
  "votes": 0,
  "createdAt": "2026-03-14T12:00:00Z"
}
```

### Option C — Voting via API

Let users upvote or downvote a specific feedback item:

```http
POST /api/feedback/[feedbackId]/vote
Content-Type: application/json

{
  "type": "up"   // or "down"
}
```

---

## 4. Public Roadmap

Share what you're building next with a fully public, no-login-required roadmap page:

```
https://productpulse.app/roadmap/[your-slug]
```

- **Layout:** Kanban-style columns — `Planned`, `In Progress`, `Released`
- **Management:** Drag & drop items between columns from your Dashboard
- **Tip:** Link to this page in your marketing emails and changelog posts to keep customers engaged

---

## 5. Changelog & Release Notes

### Publishing a New Entry

1. Go to **Dashboard → Changelog → New Entry**
2. Add a **title**, **date**, and your **release notes** in the Markdown editor
3. (Optional) Use the **AI Generator** to draft notes automatically (see [Section 7](#7-ai-features))
4. Toggle **Published** and click **Publish**

Your changelog is then available at:

```
https://productpulse.app/changelog/[your-slug]
```

### Fetching Changelog via API

Retrieve published changelog entries for your own UI or integrations:

```http
GET /api/changelog?companyId=YOUR_COMPANY_ID&published=true
```

**Response:**

```json
[
  {
    "id": "cl_01xyz...",
    "title": "v2.1 — Dark Mode & Performance",
    "content": "## What's New\n- Dark mode...",
    "publishedAt": "2026-03-14T00:00:00Z"
  }
]
```

---

## 6. Embeddable "What's New" Widget

The widget shows a floating **"What's New"** bubble in the corner of your app. When clicked, it displays your latest changelog entries — no extra page required.

### Installation (2 steps)

**Step 1:** Copy your Company ID from **Dashboard → Settings → Widget**.

**Step 2:** Paste this snippet just before the closing `</body>` tag of your app:

```html
<script
  src="https://productpulse.app/widget.js"
  data-company="YOUR_COMPANY_ID"
></script>
```

### Behavior

- 💬 **Floating bubble** appears in the bottom-right corner
- 🔴 **Notification dot** lights up when new updates are published
- 📜 **Click to open** a feed of the latest 5 changelog entries
- 🌙 **Dark-mode aesthetic** — fits modern SaaS dashboards out of the box

### Pre-built Script Tag

You can also copy the fully configured `<script>` tag straight from the dashboard:

> **Dashboard → Settings → Widget → Copy Script Tag**

---

## 7. AI Features

ProductPulse AI includes two built-in AI capabilities, powered by OpenAI.

### AI Release Notes Generator

Automatically draft a polished changelog entry:

1. Go to **Dashboard → Changelog → New Entry**
2. Click **✨ Generate with AI**
3. The AI reads your latest feedback and roadmap items to produce a structured draft
4. Edit and publish as needed

### AI Feedback Clustering

Group raw feedback submissions into logical themes automatically:

1. Go to **Dashboard → Feedback → Cluster**
2. Click **Cluster Feedback**
3. The AI organizes similar requests into named groups (e.g., "Performance Requests", "UI Improvements")
4. Use clusters to prioritize your roadmap faster

> You can also trigger clustering via the API:
> ```http
> POST /api/ai/cluster
> Content-Type: application/json
> { "companyId": "YOUR_COMPANY_ID" }
> ```

---

## 8. Analytics

The Analytics dashboard gives you a real-time view of what your users care about:

| Metric | Description |
|---|---|
| **Top Voted Features** | Ranked list of most-upvoted feedback |
| **Vote Trend** | Votes over time (daily/weekly) |
| **Status Distribution** | How many items are Open / Planned / Released |
| **Feedback Volume** | New submissions over time |

Access it at **Dashboard → Analytics**.

---

## 9. Email Notifications

ProductPulse AI sends automatic email updates powered by **Resend**:

- 📬 **Subscribers** are notified when a new changelog entry is published
- 🗳️ **Authors** are notified when their feedback request changes status (e.g., moves to "Planned")

Users can subscribe to updates directly from your public changelog page.

---

## 10. API Reference

All endpoints are relative to `https://productpulse.app`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/changelog?companyId=ID&published=true` | List published changelog entries |
| `POST` | `/api/changelog` | Create a new changelog entry |
| `GET` | `/api/feedback?companyId=ID` | List all feedback for a company |
| `POST` | `/api/feedback` | Submit a new feedback item |
| `POST` | `/api/feedback/[id]/vote` | Vote on a feedback item |
| `GET` | `/api/roadmap?companyId=ID` | Get roadmap items |
| `POST` | `/api/ai/cluster` | Trigger AI feedback clustering |

> 🔐 **Authentication:** API routes that modify data require your company's session or an API key configured in **Dashboard → Settings → API**.

---

## 11. Billing & Plans

ProductPulse AI uses **Stripe** for subscription management.

- View your current plan at **Dashboard → Settings → Billing**
- Upgrade or downgrade at any time — changes take effect immediately
- Stripe test mode is available during development (see [Setup Guide](./SETUP_GUIDE.md))

Available plans typically include limits on:
- Number of team members
- Feedback submissions per month
- AI generation credits

---

## 12. Tips & Best Practices

✅ **Add the feedback link to your app's help menu** — makes it discoverable without being intrusive.

✅ **Publish changelogs on a regular cadence** (e.g., weekly or per sprint) — builds trust with users.

✅ **Use AI Clustering before roadmap reviews** — quickly surface the highest-impact themes from unstructured feedback.

✅ **Keep your roadmap public** — transparently sharing "what's coming" dramatically reduces support tickets asking "when will X be available?"

✅ **Use the widget script tag instead of linking to your changelog** — keeps users inside your product and increases engagement.

---

## 📚 Related Docs

- [Setup Guide](./SETUP_GUIDE.md) — Connect external services (DB, Auth, Stripe, etc.)
- [Company Integration Guide](./COMPANY_INTEGRATION.md) — Embed links and widgets into your product

---

**Questions?** Reach out to our support team or open an issue in the project repository.
