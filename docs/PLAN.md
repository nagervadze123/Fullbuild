# PLAN

<!--
1) Scaffold a Next.js 15+ TypeScript App Router project with Tailwind and set up pnpm scripts, Vitest, Drizzle, and required dependencies.
2) Define Drizzle Postgres schema and migration for runs/niches tables plus config and DB client.
3) Build domain logic modules for niche generation, generic specialization, validation, scoring, asset factory, trends adapter, and CSV export.
4) Implement server actions (createRun, generateNiches, toggleSave, generateAssets) with Zod validation and DB persistence.
5) Build pages/routes: /, /results/[runId], /niche/[id], /saved using shadcn/ui + TanStack Table with filters, sorting, loading states, and empty states.
6) Add unit tests for specialization/filter, audience-problem-context validation, scoring determinism, and CSV escaping.
7) Document setup/env/run instructions and finish with lint, typecheck, tests.
-->
