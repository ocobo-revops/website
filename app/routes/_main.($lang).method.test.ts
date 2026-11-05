/**
 * End-to-end i18n routing through a real `($lang)` loader: nothing is
 * mocked, so the redirect, the language check and the server translations
 * all run as in production.
 */

import { describe, expect, it } from 'vitest';

import { invokeLoader } from '~/test/loader-harness';

import { loader } from './_main.($lang).method';

describe('method loader i18n routing', () => {
  it('redirects a path without prefix to the French page', async () => {
    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/method',
      params: {},
    });

    expect(outcome.type).toBe('response');
    if (outcome.type !== 'response') return;
    expect(outcome.response.status).toBe(301);
    expect(outcome.response.headers.get('Location')).toBe('/fr/method');
  });

  it('serves French copy under /fr', async () => {
    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/fr/method',
      params: { lang: 'fr' },
    });

    expect(outcome.type).toBe('data');
    if (outcome.type !== 'data') return;
    expect(outcome.data.title).toBe('Notre méthode');
  });

  it('serves English copy under /en', async () => {
    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/en/method',
      params: { lang: 'en' },
    });

    expect(outcome.type).toBe('data');
    if (outcome.type !== 'data') return;
    expect(outcome.data.title).toBe('Our method');
  });

  it('answers 404 for an unknown prefix', async () => {
    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/de/method',
      params: { lang: 'de' },
    });

    expect(outcome.type).toBe('response');
    if (outcome.type !== 'response') return;
    expect(outcome.response.status).toBe(404);
  });
});
