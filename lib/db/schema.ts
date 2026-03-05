import { boolean, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('run_status', ['pending', 'completed', 'failed']);

export const runs = pgTable('runs', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  seedKeyword: text('seed_keyword').notNull(),
  region: text('region'),
  audience: text('audience'),
  settings: jsonb('settings').$type<Record<string, unknown>>().notNull(),
  status: statusEnum('status').default('pending').notNull()
});

export const niches = pgTable('niches', {
  id: uuid('id').defaultRandom().primaryKey(),
  runId: uuid('run_id').notNull().references(() => runs.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  title: text('title').notNull(),
  audience: text('audience').notNull(),
  problem: text('problem').notNull(),
  context: text('context').notNull(),
  category: text('category').notNull(),
  tags: jsonb('tags').$type<string[]>().notNull(),
  scoreTotal: integer('score_total').notNull(),
  scoreDemand: integer('score_demand').notNull(),
  scoreBuyer: integer('score_buyer').notNull(),
  scoreCompetition: integer('score_competition').notNull(),
  scoreProductFit: integer('score_product_fit').notNull(),
  reasons: jsonb('reasons').$type<string[]>().notNull(),
  keywords: jsonb('keywords').$type<string[]>().notNull(),
  trendSummary: jsonb('trend_summary').$type<Record<string, unknown> | null>(),
  assets: jsonb('assets').$type<Record<string, unknown> | null>(),
  isSaved: boolean('is_saved').default(false).notNull(),
  isGeneratedAssets: boolean('is_generated_assets').default(false).notNull()
});
