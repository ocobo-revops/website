export const url = {
  homepage: '/',
  strategy: '/strategies-revenue-operations',
  projects: '/projets-revops',
  stories: '/clients',
  about:
    'https://ocobo.notion.site/Ocobo-Qui-sommes-nous-b94fb96269cb4d6294cdf21569ebd479',
  careers:
    'https://ocobo.notion.site/Ocobo-Nous-rejoindre-416ea4a060fb48d6a9666a8d4debfb6a',
  news: '/news',
  webinars: '/webinars',
  blog: '/blog',
  contact: '/contact',
  offers: '/offers',
  tools: '/tools',
  privacy: '/privacy',
  notFound: '/404',
  podcasts: 'https://podcast.ausha.co/revenue-echoes',
};

export const getImageOgFullPath = (name: string, url: string) => {
  const ogImageUrl = new URL(`/og/${name}.jpg`, url);
  return ogImageUrl.href;
};
