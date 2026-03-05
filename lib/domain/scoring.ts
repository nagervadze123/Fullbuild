import { GENERIC_BLACKLIST } from './generation';
import type { NicheCandidate } from './types';

export type ScoreResult = {
  scoreTotal: number;
  scoreDemand: number;
  scoreBuyer: number;
  scoreCompetition: number;
  scoreProductFit: number;
  reasons: string[];
  fixSuggestions: string[];
};

export function scoreNiche(candidate: NicheCandidate, trendMomentum = 0): ScoreResult {
  const text = `${candidate.title} ${candidate.problem}`.toLowerCase();
  const reasons: string[] = [];
  const fixes: string[] = [];

  let demand = 20 + Math.min(10, candidate.keywords.length);
  if (trendMomentum > 0) {
    demand += Math.min(5, trendMomentum);
    reasons.push('Positive trend momentum increased demand score.');
  }
  if (/season|q4|launch|deadline|urgent/.test(text)) {
    demand += 4;
    reasons.push('Urgency/time context improved demand.');
  }
  demand = Math.min(35, demand);

  let buyer = /freelance|creator|seller|designer|bookkeeper/.test(text) ? 18 : 12;
  if (/roi|client|revenue|onboard/.test(text)) {
    buyer += 5;
    reasons.push('Clear ROI signal improved buyer strength.');
  }
  buyer = Math.min(25, buyer);

  let competition = 16;
  if (GENERIC_BLACKLIST.some((t) => text.includes(` ${t} `))) {
    competition -= 8;
    fixes.push('Replace generic wording with industry + deliverable + outcome constraints.');
  }
  if (candidate.title.split(' ').length < 8) {
    competition -= 5;
    fixes.push('Add more specific context such as region, timeframe, or channel.');
  }
  competition = Math.max(0, Math.min(20, competition));

  let productFit = /template|checklist|planner|notion|swipe|tracker|script/.test(text) ? 18 : 10;
  if (/under 2-hour|first 10 clients|quickly/.test(text)) {
    productFit += 2;
  }
  productFit = Math.min(20, productFit);

  const total = demand + buyer + competition + productFit;
  if (!reasons.length) reasons.push('Balanced niche with viable digital product format.');
  if (!fixes.length) fixes.push('Test narrower sub-audiences to improve conversion certainty.');

  return { scoreTotal: total, scoreDemand: demand, scoreBuyer: buyer, scoreCompetition: competition, scoreProductFit: productFit, reasons, fixSuggestions: fixes };
}
