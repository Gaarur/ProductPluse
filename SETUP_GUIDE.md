# 🔌 ProductPulse AI Connection Guide

This guide explains how to obtain the necessary API keys and connect your services to ProductPulse AI.

## 1. NeonDB (PostgreSQL)
- **Where to get it:** [neon.tech](https://neon.tech)
- **Steps:**
  1. Create a new project.
  2. Copy the **Connection String** (PostgreSQL URL).
  3. Paste it as `DATABASE_URL` in `.env.local`.
- **Initialization:** Run `npm run db:push` in your terminal to create the tables.

## 2. Clerk (Authentication)
- **Where to get it:** [clerk.com](https://clerk.com)
- **Steps:**
  1. Create a new application.
  2. In **API Keys**, copy the `Publishable key` and `Secret key`.
  3. Paste them as `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
  4. Ensure you enable the **Email** and **Name** factors in the dashboard.

## 3. OpenAI (AI Features)
- **Where to get it:** [platform.openai.com](https://platform.openai.com)
- **Steps:**
  1. Go to **API Keys**.
  2. Create a new secret key.
  3. Paste it as `OPENAI_API_KEY`.
- **Usage:** This powers the release notes generator and feedback clustering.

## 4. Stripe (Payments)
- **Where to get it:** [stripe.com](https://stripe.com)
- **Steps:**
  1. Toggle to **Test Mode**.
  2. Under **Developers > API Keys**, get your `Publishable key` and `Secret key`.
  3. Under **Webhooks**, add an endpoint pointing to `https://your-domain.com/api/stripe/webhook` (or use the Stripe CLI for local testing).
  4. Copy the **Webhook Signing Secret**.
  5. Paste them as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET`.

## 5. Resend (Emails)
- **Where to get it:** [resend.com](https://resend.com)
- **Steps:**
  1. Create an account.
  2. Create an **API Key**.
  3. Paste it as `RESEND_API_KEY`.
  4. Verify your domain in the Resend dashboard if using a custom sender address.

## 🏁 Final Step
Once all keys are in `.env.local`, restart your development server:
```bash
npm run dev
```
