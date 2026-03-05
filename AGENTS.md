# AGENTS.md

## Stack
- Next.js 15+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Drizzle ORM
- Postgres (via Supabase)
- Zod validation
- TanStack Table for results table

## Commands
- `pnpm install`
- `pnpm dev`
- `pnpm lint`
- `pnpm test` (Vitest)
- `pnpm typecheck`

## Code style
- Functional React components
- Use server actions for mutations
- Use route handlers only when needed
- Keep dependencies minimal
- Do not use Prisma

## Safety
- Never log secrets
- Validate all inputs
- Sanitize user-provided text
- Use safe CSV export

## Quality
- Make small commits
- Keep clear messages in summaries
- Add basic tests for scoring and anti-generic rules

## Ambiguity handling
- If something is ambiguous, decide sensibly and proceed without asking unless absolutely blocking
