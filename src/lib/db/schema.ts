import { 
  pgTable, 
  text, 
  timestamp, 
  integer, 
  boolean,
  uuid,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────

export const planEnum = pgEnum("plan", ["free", "starter", "growth", "pro", "enterprise"]);
export const feedbackStatusEnum = pgEnum("feedback_status", ["open", "planned", "in_progress", "completed", "declined"]);
export const roadmapStatusEnum = pgEnum("roadmap_status", ["planned", "in_progress", "released"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "canceled", "past_due", "trialing"]);
export const userRoleEnum = pgEnum("user_role", ["owner", "admin", "member"]);

// ─────────────────────────────────────────────
// Companies (tenant root)
// ─────────────────────────────────────────────

export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  plan: planEnum("plan").default("free").notNull(),
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [uniqueIndex("companies_slug_idx").on(t.slug)]);

// ─────────────────────────────────────────────
// Users
// ─────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull(),
  email: text("email").notNull(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  role: userRoleEnum("role").default("member").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [uniqueIndex("users_clerk_id_idx").on(t.clerkId)]);

// ─────────────────────────────────────────────
// Feedback
// ─────────────────────────────────────────────

export const feedback = pgTable("feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: feedbackStatusEnum("status").default("open").notNull(),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  voteCount: integer("vote_count").default(0).notNull(),
  category: text("category"),
  isPublic: boolean("is_public").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("feedback_company_id_idx").on(t.companyId),
  index("feedback_status_idx").on(t.status),
]);

// ─────────────────────────────────────────────
// Votes
// ─────────────────────────────────────────────

export const votes = pgTable("votes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  feedbackId: uuid("feedback_id").references(() => feedback.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [uniqueIndex("votes_user_feedback_idx").on(t.userId, t.feedbackId)]);

// ─────────────────────────────────────────────
// Comments
// ─────────────────────────────────────────────

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  feedbackId: uuid("feedback_id").references(() => feedback.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  content: text("content").notNull(),
  isInternal: boolean("is_internal").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("comments_feedback_id_idx").on(t.feedbackId)]);

// ─────────────────────────────────────────────
// Roadmap Items
// ─────────────────────────────────────────────

export const roadmapItems = pgTable("roadmap_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }).notNull(),
  feedbackId: uuid("feedback_id").references(() => feedback.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description"),
  status: roadmapStatusEnum("status").default("planned").notNull(),
  voteCount: integer("vote_count").default(0).notNull(),
  targetDate: timestamp("target_date"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("roadmap_company_id_idx").on(t.companyId),
  index("roadmap_status_idx").on(t.status),
]);

// ─────────────────────────────────────────────
// Changelog
// ─────────────────────────────────────────────

export const changelogs = pgTable("changelogs", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  version: text("version"),
  isPublished: boolean("is_published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  aiGenerated: boolean("ai_generated").default(false).notNull(),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("changelog_company_id_idx").on(t.companyId),
  index("changelog_published_idx").on(t.isPublished),
]);

// ─────────────────────────────────────────────
// Changelog Subscribers
// ─────────────────────────────────────────────

export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }).notNull(),
  email: text("email").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [uniqueIndex("subscribers_company_email_idx").on(t.companyId, t.email)]);

// ─────────────────────────────────────────────
// Feature Analytics
// ─────────────────────────────────────────────

export const featureAnalytics = pgTable("feature_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }).notNull(),
  featureName: text("feature_name").notNull(),
  usageCount: integer("usage_count").default(0).notNull(),
  dailyActiveUsers: integer("daily_active_users").default(0).notNull(),
  retentionImpact: integer("retention_impact").default(0).notNull(),
  date: timestamp("date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("analytics_company_id_idx").on(t.companyId)]);

// ─────────────────────────────────────────────
// Subscriptions
// ─────────────────────────────────────────────

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }).notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  plan: planEnum("plan").default("free").notNull(),
  status: subscriptionStatusEnum("status").default("active").notNull(),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  uniqueIndex("subscriptions_company_id_idx").on(t.companyId),
  index("subscriptions_stripe_customer_idx").on(t.stripeCustomerId),
]);

// ─────────────────────────────────────────────
// Integrations (Slack, Github, etc.)
// ─────────────────────────────────────────────

export const integrations = pgTable("integrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }).notNull(),
  type: text("type").notNull(), // 'github', 'slack', 'linear', 'jira', 'zapier'
  config: text("config"), // JSON string or encrypted token/webhook
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [uniqueIndex("integrations_company_type_idx").on(t.companyId, t.type)]);

// ─────────────────────────────────────────────
// Roadmap Followers (notify on status change)
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// Roadmap Followers (notify on status change)
// ─────────────────────────────────────────────

export const roadmapFollowers = pgTable("roadmap_followers", {
  id: uuid("id").primaryKey().defaultRandom(),
  roadmapItemId: uuid("roadmap_item_id").references(() => roadmapItems.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [uniqueIndex("roadmap_followers_idx").on(t.roadmapItemId, t.userId)]);

// ─────────────────────────────────────────────
// Relations
// ─────────────────────────────────────────────

export const companiesRelations = relations(companies, ({ many }) => ({
  users: many(users),
  feedback: many(feedback),
  roadmapItems: many(roadmapItems),
  changelogs: many(changelogs),
  featureAnalytics: many(featureAnalytics),
  subscriptions: many(subscriptions),
  subscribers: many(subscribers),
  integrations: many(integrations),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  company: one(companies, { fields: [users.companyId], references: [companies.id] }),
  feedback: many(feedback),
  votes: many(votes),
  comments: many(comments),
}));

export const feedbackRelations = relations(feedback, ({ one, many }) => ({
  company: one(companies, { fields: [feedback.companyId], references: [companies.id] }),
  createdByUser: one(users, { fields: [feedback.createdBy], references: [users.id] }),
  votes: many(votes),
  comments: many(comments),
}));

export const changelogs_relations = relations(changelogs, ({ one }) => ({
  company: one(companies, { fields: [changelogs.companyId], references: [companies.id] }),
}));

export const roadmapItemsRelations = relations(roadmapItems, ({ one, many }) => ({
  company: one(companies, { fields: [roadmapItems.companyId], references: [companies.id] }),
  linkedFeedback: one(feedback, { fields: [roadmapItems.feedbackId], references: [feedback.id] }),
  followers: many(roadmapFollowers),
}));

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Feedback = typeof feedback.$inferSelect;
export type NewFeedback = typeof feedback.$inferInsert;
export type Vote = typeof votes.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type RoadmapItem = typeof roadmapItems.$inferSelect;
export type Changelog = typeof changelogs.$inferSelect;
export type FeatureAnalytic = typeof featureAnalytics.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Integration = typeof integrations.$inferSelect;
