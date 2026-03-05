import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { niches } from '@/lib/db/schema';
import { toCsv } from '@/lib/utils/csv';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const runId = url.searchParams.get('runId');
  if (!runId) return NextResponse.json({ error: 'runId required' }, { status: 400 });
  const rows = await db.select().from(niches).where(eq(niches.runId, runId));
  const csv = toCsv(rows.map((r) => ({
    id: r.id,
    title: r.title,
    audience: r.audience,
    category: r.category,
    scoreTotal: r.scoreTotal,
    scoreDemand: r.scoreDemand,
    scoreBuyer: r.scoreBuyer,
    scoreCompetition: r.scoreCompetition,
    scoreProductFit: r.scoreProductFit,
    keywordsTop5: (r.keywords as string[]).slice(0, 5).join('|')
  })));
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="niche-results.csv"'
    }
  });
}
