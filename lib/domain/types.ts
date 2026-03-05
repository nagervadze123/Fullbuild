export const PRODUCT_FORMATS = [
  'templates',
  'notion systems',
  'canva kits',
  'planners',
  'checklists',
  'prompt packs',
  'swipe files',
  'scripts',
  'trackers'
] as const;

export type ProductFormat = (typeof PRODUCT_FORMATS)[number];

export type NicheCandidate = {
  title: string;
  audience: string;
  problem: string;
  context: string;
  category: string;
  keywords: string[];
  tags: string[];
  mainKeyword: string;
};
