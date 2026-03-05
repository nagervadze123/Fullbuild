import { describe, expect, it } from 'vitest';
import { scoreNiche } from '@/lib/domain/scoring';

const input = {
  title: 'Freelance wedding photographers struggle to onboard clients quickly in the UK - templates',
  audience: 'Freelance wedding photographers',
  problem: 'struggle to onboard clients quickly',
  context: 'in the UK',
  category: 'templates',
  tags: ['templates'],
  keywords: ['onboarding templates'],
  mainKeyword: 'onboarding templates'
};

describe('scoring determinism', () => {
  it('returns same score for same input', () => {
    const a = scoreNiche(input, 1);
    const b = scoreNiche(input, 1);
    expect(a).toEqual(b);
  });
});
