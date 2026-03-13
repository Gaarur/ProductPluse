# 🏢 Company Integration Guide

Welcome to ProductPulse AI! This guide explains how you can integrate ProductPulse features directly into your own product and share them with your users.

## 1. Public Feedback Board
Sharing your feedback board allows your users to submit ideas and vote on features.

- **Link:** `https://productpulse.io/feedback/[your-company-slug]`
- **How to use:** Add this link to your application's navigation menu, footer, or "Help" section.
- **Features:** 
  - User submissions
  - Voting system
  - Status tracking (Open, Planned, etc.)

## 2. Public Roadmap
Keep your customers excited by showing them what you are working on.

- **Link:** `https://productpulse.io/roadmap/[your-company-slug]`
- **How to use:** Share this link in your marketing emails or integrate it as an iframe/link within your dashboard.
- **Layout:** Kanban-style board (Planned, In Progress, Released).

## 3. "What's New" Widget (Changelog Embed)
Show a beautiful floating popup with your latest updates directly inside your SaaS application.

### Installation
Add the following script tag just before the closing `</body>` tag of your application:

```html
<script 
  src="https://productpulse.app/widget.js" 
  data-company="YOUR_COMPANY_ID"
></script>
```

### Configuration
1. **Find your Company ID:** Go to **Dashboard > Settings > Widget** to copy your unique ID and pre-configured script tag.
2. **Customization:** The widget automatically inherits a premium dark-mode aesthetic that fits most modern SaaS platforms.
3. **Behavior:** 
   - Displays a floating bubble in the bottom-right corner.
   - Shows a notification dot when new updates are available.
   - Click to open a feed of the latest 5 published changelog entries.

## 4. Custom Integrations (API)
If you want to build your own custom UI, you can use our public endpoints:

- **Fetch Changelog:** `GET /api/changelog?companyId=[ID]&published=true`
- **Submit Feedback:** `POST /api/feedback` (Requires `companyId`)

---

**Need Help?**
If you have questions about integrating ProductPulse, reach out to our support team or check our [Setup Guide](./SETUP_GUIDE.md).
