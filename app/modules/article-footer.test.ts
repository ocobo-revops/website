import { describe, expect, it } from 'vitest';
import { selectArticleFooter } from './article-footer';

describe('selectArticleFooter', () => {
  it('returns podcast when podcastId is present', () => {
    expect(
      selectArticleFooter({
        podcastId: '4Pg3gfj8z0gx',
        youtubeId: 'dQw4w9WgXcQ',
      }),
    ).toBe('podcast');
  });

  it('returns youtube when only youtubeId is present', () => {
    expect(selectArticleFooter({ youtubeId: 'dQw4w9WgXcQ' })).toBe('youtube');
  });

  it('returns none when neither is present', () => {
    expect(selectArticleFooter({})).toBe('none');
  });

  it('returns podcast over youtube (priority)', () => {
    expect(
      selectArticleFooter({
        podcastId: '4Pg3gfj8z0gx',
        youtubeId: 'dQw4w9WgXcQ',
      }),
    ).toBe('podcast');
  });
});
