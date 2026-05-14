import { describe, expect, it } from 'vitest';
import { selectArticleFooter } from './article-footer';

describe('selectArticleFooter', () => {
  it('returns podcast shape when podcastId is present', () => {
    expect(
      selectArticleFooter({
        podcastId: '4Pg3gfj8z0gx',
        youtubeId: 'dQw4w9WgXcQ',
      }),
    ).toEqual({
      type: 'podcast',
      podcastId: '4Pg3gfj8z0gx',
      showId: undefined,
    });
  });

  it('includes podcastShowId as showId when provided', () => {
    expect(
      selectArticleFooter({
        podcastId: '4Pg3gfj8z0gx',
        podcastShowId: 'CUSTOMSHOW123',
      }),
    ).toEqual({
      type: 'podcast',
      podcastId: '4Pg3gfj8z0gx',
      showId: 'CUSTOMSHOW123',
    });
  });

  it('returns youtube shape when only youtubeId is present', () => {
    expect(selectArticleFooter({ youtubeId: 'dQw4w9WgXcQ' })).toEqual({
      type: 'youtube',
      youtubeId: 'dQw4w9WgXcQ',
    });
  });

  it('returns none when neither is present', () => {
    expect(selectArticleFooter({})).toEqual({ type: 'none' });
  });

  it('prefers podcast over youtube when both are present', () => {
    expect(
      selectArticleFooter({
        podcastId: '4Pg3gfj8z0gx',
        youtubeId: 'dQw4w9WgXcQ',
      }),
    ).toMatchObject({ type: 'podcast' });
  });
});
