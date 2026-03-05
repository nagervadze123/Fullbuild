import { redirect } from 'next/navigation';
import { createRun, generateNiches } from '@/lib/actions/niche-actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function HomePage() {
  async function onSubmit(formData: FormData) {
    'use server';
    const run = await createRun({
      seedKeyword: String(formData.get('seedKeyword') || ''),
      region: String(formData.get('region') || ''),
      audience: String(formData.get('audience') || '')
    });
    await generateNiches({ runId: run.id });
    redirect(`/results/${run.id}`);
  }

  return (
    <Card className="mx-auto mt-8 max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">Niche Finder</h1>
      <p className="text-sm text-slate-600">Generate specialized niches for digital products.</p>
      <form action={onSubmit} className="space-y-3">
        <Input name="seedKeyword" placeholder="Seed keyword (e.g. client onboarding)" required />
        <Input name="region" placeholder="Optional region" />
        <Input name="audience" placeholder="Optional audience" />
        <Button type="submit">Generate Niches</Button>
      </form>
    </Card>
  );
}
