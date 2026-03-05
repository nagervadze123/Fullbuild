import Link from 'next/link';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { niches } from '@/lib/db/schema';

export default async function SavedPage() {
  const rows = await db.select().from(niches).where(eq(niches.isSaved, true));
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Saved Niches</h1>
      {rows.length === 0 ? <p className="rounded-md border bg-white p-4 text-sm text-slate-600">No saved niches yet.</p> : null}
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.id} className="rounded-md border bg-white p-3"><Link href={`/niche/${r.id}`} className="underline">{r.title}</Link></li>
        ))}
      </ul>
    </div>
  );
}
