type ArticleFooterType = 'podcast' | 'youtube' | 'none';

type ArticleFooterInput = {
  podcastId?: string;
  youtubeId?: string;
};

export const selectArticleFooter = (
  frontmatter: ArticleFooterInput,
): ArticleFooterType => {
  if (frontmatter.podcastId) return 'podcast';
  if (frontmatter.youtubeId) return 'youtube';
  return 'none';
};
