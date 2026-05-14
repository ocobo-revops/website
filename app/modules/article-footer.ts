export type ArticleFooter =
  | { type: 'podcast'; podcastId: string; showId?: string }
  | { type: 'youtube'; youtubeId: string }
  | { type: 'none' };

type ArticleFooterInput = {
  podcastId?: string;
  podcastShowId?: string;
  youtubeId?: string;
};

export const selectArticleFooter = (
  frontmatter: ArticleFooterInput,
): ArticleFooter => {
  if (frontmatter.podcastId) {
    return {
      type: 'podcast',
      podcastId: frontmatter.podcastId,
      showId: frontmatter.podcastShowId,
    };
  }
  if (frontmatter.youtubeId) {
    return { type: 'youtube', youtubeId: frontmatter.youtubeId };
  }
  return { type: 'none' };
};
