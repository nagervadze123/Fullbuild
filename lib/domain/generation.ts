import { PRODUCT_FORMATS, type NicheCandidate } from './types';

export const GENERIC_BLACKLIST = ['ai', 'agent', 'business', 'marketing', 'productivity', 'mindset', 'fitness', 'crypto', 'money', 'design', 'content'];

const audiencePool = ['freelance wedding photographers', 'etsy svg sellers', 'online course creators', 'interior designers', 'bookkeepers'];
const problemPool = ['struggle to onboard clients quickly', 'need repeatable fulfillment', 'miss deadlines during peak season', 'have inconsistent lead follow-up'];
const contextPool = ['in the UK', 'for Q4 holiday launches', 'for under 2-hour setup', 'for first 10 clients'];

const sanitize = (input: string) => input.replace(/[<>"']/g, '').trim();

export function hasAudienceProblemContext(candidate: Pick<NicheCandidate, 'audience' | 'problem' | 'context'>) {
  return [candidate.audience, candidate.problem, candidate.context].every((v) => v.trim().length > 3);
}

export function specializeGeneric(seed: string): string {
  const s = sanitize(seed).toLowerCase();
  const isGeneric = GENERIC_BLACKLIST.some((term) => s.includes(term));
  if (!isGeneric) return sanitize(seed);
  return `${audiencePool[0]} ${problemPool[0]} with checklist templates ${contextPool[0]}`;
}

function productFormatFor(i: number) {
  return PRODUCT_FORMATS[i % PRODUCT_FORMATS.length];
}

export function generateCandidates(seedKeyword: string, region?: string, audience?: string): NicheCandidate[] {
  const seed = specializeGeneric(seedKeyword);
  return Array.from({ length: 12 }).map((_, i) => {
    const a = sanitize(audience || audiencePool[i % audiencePool.length]);
    const p = problemPool[i % problemPool.length];
    const c = region ? `(${sanitize(region)})` : contextPool[i % contextPool.length];
    const format = productFormatFor(i);
    return {
      title: `${a} ${p} ${c} - ${format}`,
      audience: a,
      problem: p,
      context: c,
      category: format,
      tags: [format, 'digital-download'],
      keywords: [seed, a, p, c, format],
      mainKeyword: `${a} ${format}`
    };
  }).filter((item) => hasAudienceProblemContext(item));
}

export function enforceSellability(candidate: NicheCandidate) {
  return PRODUCT_FORMATS.some((f) => candidate.title.toLowerCase().includes(f) || candidate.category === f);
}
