export const REVENUE_ECHOES_SHOW_ID = 'wN6XqFGL519L';

type PodcastEmbedConfig = {
  podcastId: string;
  showId: string;
  src: string;
};

export const resolvePodcastEmbed = ({
  podcastId,
  showId = REVENUE_ECHOES_SHOW_ID,
}: {
  podcastId: string;
  showId?: string;
}): PodcastEmbedConfig => ({
  podcastId,
  showId,
  src: `https://www.ausha.co/podcast/${showId}/episode/${podcastId}/embed`,
});
