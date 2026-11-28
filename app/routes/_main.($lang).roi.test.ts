/**
 * Loader tests for the ROI route (#248).
 *
 * Behaviours verified:
 *  1. The page answers 404 while the `roi` flag is off.
 *  2. The meta copy resolves in the page language.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';

import { invokeLoader } from '~/test/loader-harness';

const getFixedTMock = vi.fn();
const throwIfDisabledMock = vi.fn();

vi.mock('~/localization/i18n.server', () => ({
  default: {
    getFixedT: (...args: unknown[]) => getFixedTMock(...args),
  },
}));

vi.mock('~/modules/feature-flags', () => ({
  throwIfDisabled: (...args: unknown[]) => throwIfDisabledMock(...args),
}));

vi.mock('~/utils/redirections', () => ({
  redirectWithLocale: vi.fn().mockResolvedValue(undefined),
}));

afterEach(() => {
  vi.resetAllMocks();
});

async function runLoader(url: string, params: Record<string, string> = {}) {
  const { loader } = await import('./_main.($lang).roi');
  return invokeLoader(loader, { url, params });
}

describe('roi loader', () => {
  it('answers 404 while the roi flag is off', async () => {
    throwIfDisabledMock.mockImplementation(() => {
      throw new Response('Not Found', { status: 404 });
    });

    const outcome = await runLoader('http://test.local/roi');

    expect(throwIfDisabledMock).toHaveBeenCalledWith('roi');
    expect(getFixedTMock).not.toHaveBeenCalled();
    expect(outcome.type).toBe('response');
    if (outcome.type !== 'response') throw new Error('expected a response');
    expect(outcome.response.status).toBe(404);
  });

  it('returns the French meta copy on /roi', async () => {
    getFixedTMock.mockResolvedValue((key: string) => `fr:${key}`);

    const outcome = await runLoader('http://test.local/roi');

    if (outcome.type !== 'data') throw new Error('expected data');
    expect(getFixedTMock).toHaveBeenCalledWith('fr', 'roi');
    expect(outcome.data).toEqual({
      title: 'fr:meta.title',
      description: 'fr:meta.description',
      ogImageSrc: 'http://test.local/og/homepage.jpg',
      lang: 'fr',
    });
  });

  it('returns the English meta copy on /en/roi', async () => {
    getFixedTMock.mockResolvedValue((key: string) => `en:${key}`);

    const outcome = await runLoader('http://test.local/en/roi', {
      lang: 'en',
    });

    if (outcome.type !== 'data') throw new Error('expected data');
    expect(getFixedTMock).toHaveBeenCalledWith('en', 'roi');
    expect(outcome.data.title).toBe('en:meta.title');
    expect(outcome.data.lang).toBe('en');
  });
});
