import { describe, expect, it } from 'vitest';

import { DEFAULT_LANGUAGE } from '~/modules/language';

import { defaultNS, fallbackLng, resources, supportedLngs } from './i18n';
import i18nServer from './i18n.server';

function requestWith(acceptLanguage?: string): Request {
  const headers = new Headers();
  if (acceptLanguage) headers.set('Accept-Language', acceptLanguage);
  return new Request('http://test.local/blog', { headers });
}

describe('i18n configuration', () => {
  it('supports French and English, French first', () => {
    expect(supportedLngs).toEqual(['fr', 'en']);
  });

  it('falls back to the same language as the routing default', () => {
    expect(fallbackLng).toBe('fr');
    expect(fallbackLng).toBe(DEFAULT_LANGUAGE);
    expect(defaultNS).toBe('common');
  });

  it('ships the same namespaces in both languages', () => {
    expect(Object.keys(resources.en).sort()).toEqual(
      Object.keys(resources.fr).sort(),
    );
  });
});

describe('i18nServer.getLocale', () => {
  it('uses French when the request names no language', async () => {
    await expect(i18nServer.getLocale(requestWith())).resolves.toBe('fr');
  });

  it('uses French when the browser asks for an unsupported language', async () => {
    await expect(
      i18nServer.getLocale(requestWith('de-DE,de;q=0.9')),
    ).resolves.toBe('fr');
  });

  it('honours an English Accept-Language header', async () => {
    await expect(
      i18nServer.getLocale(requestWith('en-GB,en;q=0.9')),
    ).resolves.toBe('en');
  });
});

describe('i18nServer.getFixedT', () => {
  it('loads English strings for en and French strings for fr', async () => {
    const tEn = await i18nServer.getFixedT('en', 'common');
    const tFr = await i18nServer.getFixedT('fr', 'common');

    expect(tEn('language.switch')).toBe('Choose language');
    expect(tFr('language.switch')).toBe('Choisir la langue');
  });
});
