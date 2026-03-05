import { and, desc, eq, gte, ilike, ne } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { niches } from '@/lib/db/schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ResultsTable } from '@/components/results-table';
import { GENERIC_BLACKLIST } from '@/lib/domain/generation';

export default async function ResultsPage({ params, searchParams }: { params: Promise<{ runId: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { runId } = await params;
  const query = await searchParams;
  const search = query.search || '';
  const minScore = Number(query.minScore || 0);
  const b2bOnly = query.b2b === '1';
  const excludeGeneric = query.excludeGeneric !== '0';
  const category = query.category || '';

  const conditions = [eq(niches.runId, runId), gte(niches.scoreTotal, minScore)];
  if (search) conditions.push(ilike(niches.title, `%${search}%`));
  if (b2bOnly) conditions.push(ilike(niches.audience, '%freelance%'));
  if (category) conditions.push(eq(niches.category, category));
  if (excludeGeneric) {
    for (const term of GENERIC_BLACKLIST) {
      conditions.push(ne(niches.title, term));
    }
  }

  const rows = await db.select().from(niches).where(and(...conditions)).orderBy(desc(niches.scoreTotal));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Results</h1>
      <form className="grid gap-2 rounded-md border bg-white p-3 md:grid-cols-6">
        <Input name="search" defaultValue={search} placeholder="Search" className="md:col-span-2" />
        <Input name="minScore" type="range" min={0} max={100} defaultValue={String(minScore)} className="md:col-span-2" />
        <Input name="category" defaultValue={category} placeholder="Category" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="b2b" value="1" defaultChecked={b2bOnly} /> B2B only</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="excludeGeneric" value="1" defaultChecked={excludeGeneric} /> Exclude generic</label>
        <Button type="submit" variant="outline">Apply</Button>
        <a href={`/api/export?runId=${runId}`} className="rounded-md border px-4 py-2 text-center text-sm">Export CSV</a>
      </form>
      {rows.length === 0 ? <p className="rounded-md border bg-white p-6 text-sm text-slate-600">No niches found. Try broader filters.</p> : <ResultsTable data={rows.map((r) => ({ id: r.id, title: r.title, audience: r.audience, category: r.category, scoreTotal: r.scoreTotal, isSaved: r.isSaved }))} />}
    </div>
  );
}
