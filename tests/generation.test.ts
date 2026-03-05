import { describe, expect, it } from 'vitest';
import { generateCandidates, hasAudienceProblemContext, specializeGeneric } from '@/lib/domain/generation';

describe('generic specialization', () => {
  it('rewrites generic niche seed with constraints', () => {
    const result = specializeGeneric('AI marketing');
    expect(result.toLowerCase()).not.toBe('ai marketing');
    expect(result).toContain('templates');
  });

  it('requires audience/problem/context', () => {
    expect(hasAudienceProblemContext({ audience: 'freelancers', problem: 'late clients', context: 'uk' })).toBe(false);
    expect(hasAudienceProblemContext({ audience: 'freelance designers', problem: 'late client feedback loops', context: 'for Q4 campaigns' })).toBe(true);
  });

  it('filters generated candidates to valid structures', () => {
    const generated = generateCandidates('marketing');
    expect(generated.length).toBeGreaterThan(0);
    expect(generated.every((c) => hasAudienceProblemContext(c))).toBe(true);
  });
});
