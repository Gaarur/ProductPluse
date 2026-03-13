# ProductPulse AI 🚀

ProductPulse AI is a production-ready, multi-tenant AI-powered Product Update & Feedback Management SaaS platform. It helps SaaS companies collect user feedback, manage feature requests, publish beautiful changelogs, display public roadmaps, and generate AI-assisted release notes.

## ✨ Features

- **Multi-tenant Architecture:** Isolated data per company/workspace.
- **Feedback Management:** Collect, prioritize, and allow users to vote on feature requests.
- **Public Roadmap:** Transparent Kanban-style roadmap for your users.
- **AI-Powered Changelog:** Automatically generate release notes from commits using OpenAI.
- **Analytics Dashboard:** Track feature adoption and usage metrics.
- **AI Feedback Clustering:** Automatically group raw feedback into logical themes.
- **Embeddable Widget:** Drop a "What's New" widget into your product with one script tag.
- **Billing & Subscriptions:** Full Stripe integration for managing plans and payments.
- **Email Notifications:** Automatic updates to subscribers via Resend.

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, TailwindCSS, ShadCN UI, Framer Motion.
- **Backend:** Next.js Server Actions & API Routes.
- **Database:** PostgreSQL (NeonDB) with Drizzle ORM.
- **Auth:** Clerk.
- **Payments:** Stripe.
- **Email:** Resend.
- **AI:** OpenAI API.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm.
- A NeonDB PostgreSQL database.
- A Clerk account for authentication.
- A Stripe account for payments.
- A Resend account for emails.
- An OpenAI API key.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd productpulse
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   # Database
   DATABASE_URL=your_neondb_url

   # Clerk Auth
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # OpenAI
   OPENAI_API_KEY=your_openai_key

   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_pub_key

   # Resend
   RESEND_API_KEY=your_resend_key

   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Initialize the Database:**
   ```bash
   npm run db:push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Scripts

- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm run start`: Start production server.
- `npm run lint`: Run ESLint.
- `npm run db:push`: Push local schema changes to the remote database.
- `npm run db:studio`: Open Drizzle Studio to explore your data.

## 📄 License

This project is licensed under the MIT License.
