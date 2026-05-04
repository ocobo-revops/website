const tags = {
  organisation: 'Organisation',
  strategy: 'Stratégie',
  team: 'L’équipe',
  process: 'Process & outils',
  ops: 'L’Ops',
  compensation: 'Compensation',
  deployment: 'Déploiement',
  revenue: 'Revenue Operations',
  performance: 'Performance',
  'revenue-echoes': 'Revenue Echoes',
  podcast: 'Podcast',
};

const getTag = (slug: string) => {
  return tags[slug as keyof typeof tags] ?? slug;
};

export { getTag };
