# Niche Finder MVP

Niche Finder generates specialized, sellable digital-product niches for Gumroad/Etsy/Shopify workflows.

## Stack
- Next.js 15 App Router + TypeScript
- Tailwind + shadcn-style UI primitives
- Drizzle ORM + Postgres (Supabase via `DATABASE_URL`)
- Zod validation
- TanStack Table
- Vitest

## Setup
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Copy env vars:
   ```bash
   cp .env.example .env.local
   ```
3. Set `DATABASE_URL` to Supabase Postgres connection string.
4. (Optional) Set `GOOGLE_TRENDS_API_KEY` for trends adapter.
5. Run migration SQL in `drizzle/0000_initial.sql`.
6. Start dev server:
   ```bash
   pnpm dev
   ```

## Scripts
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`

## Features shipped
- `/` Generate page with seed/region/audience
- `/results/[runId]` filterable/sortable niche table, save toggle, CSV export
- `/niche/[id]` niche breakdown + generate assets action
- `/saved` list saved niches
- Generic blacklist + specialization rules
- Audience/problem/context validator and hard filtering
- Deterministic scoring with reasons/fix suggestions
- Asset Factory payload generation and persistence
- Optional trends adapter with mock fallback when env key missing

## TODOs
- Replace trends mock with real Google Trends API contract.
- Add pagination/virtualization for large result sets.
- Expand saved state UX with optimistic revalidation.
