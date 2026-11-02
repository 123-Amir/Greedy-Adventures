export type KnowledgeSource = {
  id: string;
  title: string;
  url: string;
  captureDate: string;
  sourceType: 'static-prototype-content';
  captureMethod: 'authored-from-existing-page';
  approvedText: string;
};

export const knowledgeSources: KnowledgeSource[] = [
  {
    id: 'greedy-page-packages',
    title: 'Greedy Adventures package section',
    url: '#packages',
    captureDate: '2026-11-01',
    sourceType: 'static-prototype-content',
    captureMethod: 'authored-from-existing-page',
    approvedText:
      'The First Leap is an illustrative package for the curious. Its demo inclusions are a tandem jump with an instructor, a pre-flight briefing, and a scenic flight over the coast. The Full Send is an illustrative package and includes everything in The First Leap, jump-day photo moments, and an extended coastal flight. The Keepsake is an illustrative package and includes a personal jump-day host, curated photo moments, and a post-flight coastline toast. Package details, inclusions, availability, and pricing are not verified operational claims.',
  },
  {
    id: 'greedy-page-safety',
    title: 'Greedy Adventures safety section',
    url: '#experience',
    captureDate: '2026-11-01',
    sourceType: 'static-prototype-content',
    captureMethod: 'authored-from-existing-page',
    approvedText:
      'The page describes the experience as instructor-led from briefing to landing and says that clear information, qualified guidance, and the freedom to ask questions should come first. It also says that operational details are intentionally left open for a future operator to confirm.',
  },
  {
    id: 'greedy-page-faq',
    title: 'Greedy Adventures FAQ section',
    url: '#faq',
    captureDate: '2026-11-01',
    sourceType: 'static-prototype-content',
    captureMethod: 'authored-from-existing-page',
    approvedText:
      'The FAQ says previous experience is not required for the illustrative tandem experience, but final requirements and availability would be confirmed by the operator. Clothing, age, weight, weather, arrival, spectator, and rescheduling details are demo questions that are not confirmed.',
  },
];

const normalize = (value: string): string => value.toLowerCase().replace(/[^a-z0-9 ]/g, ' ');

export function findRelevantSources(query: string): KnowledgeSource[] {
  const terms = normalize(query).split(/\s+/).filter((term) => term.length > 2);
  const scored = knowledgeSources.map((source) => {
    const haystack = normalize(`${source.title} ${source.approvedText}`);
    const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
    return { source, score };
  });

  return scored.filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).slice(0, 2).map(({ source }) => source);
}

export function formatKnowledgeContext(sources: KnowledgeSource[]): string {
  return sources.map((source) => `[${source.id}] ${source.approvedText}`).join('\n');
}
