import { afterEach, describe, expect, it } from 'vitest';

import {
  DISABLED_PAGES_DEFAULT,
  getDisabledPages,
  isPageEnabled,
  throwIfDisabled,
} from './feature-flags';

describe('feature-flags', () => {
  const originalEnv = process.env.DISABLED_PAGES;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.DISABLED_PAGES;
    } else {
      process.env.DISABLED_PAGES = originalEnv;
    }
  });

  describe('getDisabledPages', () => {
    it('returns defaults when env var is unset', () => {
      delete process.env.DISABLED_PAGES;
      expect(getDisabledPages()).toEqual(DISABLED_PAGES_DEFAULT);
    });

    it('returns empty array when env var is empty', () => {
      process.env.DISABLED_PAGES = '';
      expect(getDisabledPages()).toEqual([]);
    });

    it('parses comma-separated slugs', () => {
      process.env.DISABLED_PAGES = 'news, tools';
      expect(getDisabledPages()).toEqual(['news', 'tools']);
    });
  });

  describe('isPageEnabled', () => {
    it('returns false for disabled pages', () => {
      process.env.DISABLED_PAGES = 'news,tools';
      expect(isPageEnabled('news')).toBe(false);
      expect(isPageEnabled('tools')).toBe(false);
    });

    it('returns true for enabled pages', () => {
      process.env.DISABLED_PAGES = 'news';
      expect(isPageEnabled('tools')).toBe(true);
    });

    it('returns true for all pages when env var is empty', () => {
      process.env.DISABLED_PAGES = '';
      expect(isPageEnabled('news')).toBe(true);
      expect(isPageEnabled('tools')).toBe(true);
    });
  });

  describe('throwIfDisabled', () => {
    it('throws 404 Response when page is disabled', () => {
      process.env.DISABLED_PAGES = 'news';
      try {
        throwIfDisabled('news');
        expect.unreachable('should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(Response);
        expect((e as Response).status).toBe(404);
      }
    });

    it('ignores invalid slugs in env var', () => {
      process.env.DISABLED_PAGES = 'news,bogus,tools';
      expect(getDisabledPages()).toEqual(['news', 'tools']);
    });

    it('does not throw when page is enabled', () => {
      process.env.DISABLED_PAGES = '';
      expect(() => throwIfDisabled('news')).not.toThrow();
    });
  });
});
