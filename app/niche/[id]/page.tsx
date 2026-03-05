import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { niches } from '@/lib/db/schema';
import { generateAssetsAction, toggleSave } from '@/lib/actions/niche-actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default async function NichePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [niche] = await db.select().from(niches).where(eq(niches.id, id));
  if (!niche) return <p>Not found</p>;

  async function onGenerateAssets() {
    'use server';
    await generateAssetsAction({ nicheId: id });
  }

  async function onToggleSave(formData: FormData) {
    'use server';
    await toggleSave({ nicheId: id, isSaved: formData.get('isSaved') === 'true' });
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{niche.title}</h1>
      <Card>
        <p><strong>Audience:</strong> {niche.audience}</p>
        <p><strong>Problem:</strong> {niche.problem}</p>
        <p><strong>Context:</strong> {niche.context}</p>
        <p><strong>Scores:</strong> {niche.scoreDemand}/{niche.scoreBuyer}/{niche.scoreCompetition}/{niche.scoreProductFit} (total {niche.scoreTotal})</p>
      </Card>
      <div className="flex gap-2">
        <form action={onGenerateAssets}><Button>Generate Assets</Button></form>
        <form action={onToggleSave}>
          <input type="hidden" name="isSaved" value={String(!niche.isSaved)} />
          <Button variant="outline">{niche.isSaved ? 'Unsave' : 'Save'}</Button>
        </form>
      </div>
      <Card>
        <h2 className="mb-2 font-semibold">Reasons and improvements</h2>
        <ul className="list-disc space-y-1 pl-5">{(niche.reasons as string[]).map((r) => <li key={r}>{r}</li>)}</ul>
      </Card>
      {niche.assets ? <pre className="overflow-x-auto rounded-md border bg-white p-4 text-xs">{JSON.stringify(niche.assets, null, 2)}</pre> : <p className="text-sm text-slate-600">No assets generated yet.</p>}
    </div>
  );
}
