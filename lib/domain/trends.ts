export type TrendSummary = { momentum: number; summary: string; source: 'heuristic' | 'google-trends' };

export async function getTrendSummary(keyword: string): Promise<TrendSummary> {
  if (!process.env.GOOGLE_TRENDS_API_KEY) {
    return { momentum: 0, summary: `Heuristic only for ${keyword}. TODO: wire real API call adapter.`, source: 'heuristic' };
  }
  // TODO: replace with real Google Trends API integration when endpoint contract is finalized.
  return { momentum: 2, summary: `Mock trend signal for ${keyword}: stable upward interest.`, source: 'google-trends' };
}
