import { describe, expect, it } from 'vitest';

import { GITHUB_RAW_HOST, getPreconnectLinks } from './preconnect-links';

describe('getPreconnectLinks', () => {
  describe('GitHub raw host', () => {
    it('includes preconnect for GitHub raw host when source is github', () => {
      const links = getPreconnectLinks('github');
      const preconnect = links.find(
        (l) => l.rel === 'preconnect' && l.href === GITHUB_RAW_HOST,
      );
      expect(preconnect).toBeDefined();
    });

    it('includes dns-prefetch for GitHub raw host when source is github', () => {
      const links = getPreconnectLinks('github');
      const dnsPrefetch = links.find(
        (l) => l.rel === 'dns-prefetch' && l.href === GITHUB_RAW_HOST,
      );
      expect(dnsPrefetch).toBeDefined();
    });

    it('omits GitHub raw host links when source is locale', () => {
      const links = getPreconnectLinks('locale');
      const githubLinks = links.filter((l) => l.href === GITHUB_RAW_HOST);
      expect(githubLinks).toHaveLength(0);
    });
  });

  describe('fonts CDN host', () => {
    it('includes preconnect for fonts CDN when host is provided', () => {
      const links = getPreconnectLinks('locale', 'https://fonts.example.com');
      const preconnect = links.find(
        (l) => l.rel === 'preconnect' && l.href === 'https://fonts.example.com',
      );
      expect(preconnect).toBeDefined();
    });

    it('includes dns-prefetch for fonts CDN when host is provided', () => {
      const links = getPreconnectLinks('locale', 'https://fonts.example.com');
      const dnsPrefetch = links.find(
        (l) =>
          l.rel === 'dns-prefetch' && l.href === 'https://fonts.example.com',
      );
      expect(dnsPrefetch).toBeDefined();
    });

    it('omits fonts CDN links when no host is provided', () => {
      const links = getPreconnectLinks('locale');
      expect(links).toHaveLength(0);
    });

    it('includes both fonts and GitHub links when both configured', () => {
      const links = getPreconnectLinks('github', 'https://fonts.example.com');
      const fontsLinks = links.filter(
        (l) => l.href === 'https://fonts.example.com',
      );
      const githubLinks = links.filter((l) => l.href === GITHUB_RAW_HOST);
      expect(fontsLinks).toHaveLength(2);
      expect(githubLinks).toHaveLength(2);
    });
  });

  describe('link attributes', () => {
    it('sets crossOrigin anonymous on preconnect links', () => {
      const links = getPreconnectLinks('github');
      const preconnect = links.find((l) => l.rel === 'preconnect');
      expect(preconnect?.crossOrigin).toBe('anonymous');
    });

    it('does not set crossOrigin on dns-prefetch links', () => {
      const links = getPreconnectLinks('github');
      const dnsPrefetch = links.find((l) => l.rel === 'dns-prefetch');
      expect(dnsPrefetch?.crossOrigin).toBeUndefined();
    });
  });
});
