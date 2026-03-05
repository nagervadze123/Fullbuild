'use server';

import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db/client';
import { niches, runs } from '@/lib/db/schema';
import { generateAssets } from '@/lib/domain/assets';
import { enforceSellability, generateCandidates } from '@/lib/domain/generation';
import { scoreNiche } from '@/lib/domain/scoring';
import { getTrendSummary } from '@/lib/domain/trends';

const textSanitizer = z.string().trim().transform((v) => v.replace(/[<>"']/g, ''));

const createRunSchema = z.object({
  seedKeyword: textSanitizer.min(2),
  region: textSanitizer.optional().or(z.literal('')),
  audience: textSanitizer.optional().or(z.literal(''))
});

export async function createRun(input: unknown) {
  const parsed = createRunSchema.parse(input);
  const [run] = await db.insert(runs).values({
    seedKeyword: parsed.seedKeyword,
    region: parsed.region || null,
    audience: parsed.audience || null,
    settings: { source: 'mvp' },
    status: 'pending'
  }).returning();
  return run;
}

const generateSchema = z.object({ runId: z.string().uuid() });
export async function generateNiches(input: unknown) {
  const parsed = generateSchema.parse(input);
  const [run] = await db.select().from(runs).where(eq(runs.id, parsed.runId));
  if (!run) throw new Error('Run not found');

  const generated = generateCandidates(run.seedKeyword, run.region || undefined, run.audience || undefined);
  for (const item of generated.filter(enforceSellability)) {
    const trend = await getTrendSummary(item.mainKeyword);
    const score = scoreNiche(item, trend.momentum);
    await db.insert(niches).values({
      runId: run.id,
      title: item.title,
      audience: item.audience,
      problem: item.problem,
      context: item.context,
      category: item.category,
      tags: item.tags,
      scoreTotal: score.scoreTotal,
      scoreDemand: score.scoreDemand,
      scoreBuyer: score.scoreBuyer,
      scoreCompetition: score.scoreCompetition,
      scoreProductFit: score.scoreProductFit,
      reasons: [...score.reasons, ...score.fixSuggestions],
      keywords: item.keywords,
      trendSummary: trend,
      assets: null,
      isSaved: false,
      isGeneratedAssets: false
    });
  }

  await db.update(runs).set({ status: 'completed' }).where(eq(runs.id, run.id));
  return run.id;
}

const toggleSaveSchema = z.object({ nicheId: z.string().uuid(), isSaved: z.boolean() });
export async function toggleSave(input: unknown) {
  const parsed = toggleSaveSchema.parse(input);
  await db.update(niches).set({ isSaved: parsed.isSaved }).where(eq(niches.id, parsed.nicheId));
}

const assetsSchema = z.object({ nicheId: z.string().uuid() });
export async function generateAssetsAction(input: unknown) {
  const parsed = assetsSchema.parse(input);
  const [niche] = await db.select().from(niches).where(eq(niches.id, parsed.nicheId));
  if (!niche) throw new Error('Niche not found');
  const payload = generateAssets({
    title: niche.title,
    audience: niche.audience,
    problem: niche.problem,
    context: niche.context,
    category: niche.category,
    tags: niche.tags,
    keywords: niche.keywords,
    mainKeyword: niche.keywords[0] || niche.title
  });
  await db.update(niches).set({ assets: payload, isGeneratedAssets: true }).where(eq(niches.id, parsed.nicheId));
  return payload;
}
