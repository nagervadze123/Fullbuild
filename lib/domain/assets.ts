import type { NicheCandidate } from './types';

export function generateAssets(niche: NicheCandidate) {
  const base = `${niche.audience} ${niche.problem} ${niche.context}`;
  return {
    ideas: Array.from({ length: 10 }).map((_, i) => `${niche.category} pack #${i + 1}: ${base}`),
    gumroad: {
      title: `${niche.audience} ${niche.category} toolkit`,
      subtitle: `Solve ${niche.problem} fast with proven workflows`,
      bulletBenefits: ['Faster setup', 'Repeatable outcomes', 'Editable assets', 'Built for beginners', 'Action-oriented'],
      faq: Array.from({ length: 5 }).map((_, i) => `FAQ ${i + 1}: How does this help ${niche.audience}?`),
      guarantee: '14-day practical implementation guarantee.'
    },
    hooks: Array.from({ length: 10 }).map((_, i) => `Hook ${i + 1}: Stop ${niche.problem} with this ${niche.category}.`),
    threads: Array.from({ length: 5 }).map((_, i) => `Thread ${i + 1}: ${base}`),
    pinTitles: Array.from({ length: 5 }).map((_, i) => `Pinterest ${i + 1}: ${niche.category} for ${niche.audience}`),
    keywords: {
      longTail: Array.from({ length: 20 }).map((_, i) => `${niche.mainKeyword} long tail ${i + 1}`),
      painQueries: Array.from({ length: 10 }).map((_, i) => `how to fix ${niche.problem} ${i + 1}`)
    },
    altText: [
      `SEO thumbnail: ${niche.title} digital download preview with clear benefits`,
      `SEO thumbnail: editable ${niche.category} workflow for ${niche.audience}`
    ]
  };
}
