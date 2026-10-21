import { describe, expect, it } from 'vitest';

import { getLanguageSwitchPath, getPathLanguage } from './language-path';

describe('getLanguageSwitchPath', () => {
  it('swaps the locale segment and keeps the rest of the path', () => {
    expect(getLanguageSwitchPath('/fr/offer', 'en')).toBe('/en/offer');
    expect(getLanguageSwitchPath('/en/clients/acme', 'fr')).toBe(
      '/fr/clients/acme',
    );
  });

  it('handles the locale home page', () => {
    expect(getLanguageSwitchPath('/fr', 'en')).toBe('/en');
    expect(getLanguageSwitchPath('/en/', 'fr')).toBe('/fr/');
  });

  it('keeps the current language as is', () => {
    expect(getLanguageSwitchPath('/fr/offer', 'fr')).toBe('/fr/offer');
  });

  it('sends a path without locale prefix to the target home page', () => {
    expect(getLanguageSwitchPath('/blog/some-post', 'en')).toBe('/en');
    expect(getLanguageSwitchPath('/', 'fr')).toBe('/fr');
  });

  it('does not treat a segment that only starts with a locale as one', () => {
    expect(getLanguageSwitchPath('/frontend', 'en')).toBe('/en');
  });
});

describe('getPathLanguage', () => {
  it('reads the locale prefix', () => {
    expect(getPathLanguage('/en/offer', 'fr')).toBe('en');
    expect(getPathLanguage('/fr', 'en')).toBe('fr');
  });

  it('falls back without a locale prefix', () => {
    expect(getPathLanguage('/blog/post', 'en')).toBe('en');
    expect(getPathLanguage('/english', 'fr')).toBe('fr');
  });
});
