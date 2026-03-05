import { describe, expect, it } from 'vitest';
import { csvEscape } from '@/lib/utils/csv';

describe('csv escaping', () => {
  it('escapes quotes and wraps in quotes', () => {
    expect(csvEscape('a"b,c')).toBe('"a""b,c"');
  });
});
