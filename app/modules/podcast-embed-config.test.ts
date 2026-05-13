import { describe, expect, it } from 'vitest';
import {
  REVENUE_ECHOES_SHOW_ID,
  resolvePodcastEmbed,
} from './podcast-embed-config';

describe('podcast-embed-config', () => {
  describe('REVENUE_ECHOES_SHOW_ID', () => {
    it('is the expected constant', () => {
      expect(REVENUE_ECHOES_SHOW_ID).toBe('wN6XqFGL519L');
    });
  });

  describe('resolvePodcastEmbed', () => {
    it('uses the default show ID when none provided', () => {
      const result = resolvePodcastEmbed({ podcastId: '4Pg3gfj8z0gx' });
      expect(result.showId).toBe(REVENUE_ECHOES_SHOW_ID);
      expect(result.podcastId).toBe('4Pg3gfj8z0gx');
    });

    it('uses a custom show ID when provided', () => {
      const result = resolvePodcastEmbed({
        podcastId: '4Pg3gfj8z0gx',
        showId: 'customShow123',
      });
      expect(result.showId).toBe('customShow123');
    });

    it('builds the correct Ausha embed src', () => {
      const result = resolvePodcastEmbed({ podcastId: '4Pg3gfj8z0gx' });
      expect(result.src).toBe(
        `https://www.ausha.co/podcast/${REVENUE_ECHOES_SHOW_ID}/episode/4Pg3gfj8z0gx/embed`,
      );
    });
  });
});
