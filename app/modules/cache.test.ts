// @vitest-environment node
// Why node: cache.ts is a server-side module; jsdom is irrelevant here.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createHybridLoader,
  getCacheHeaders,
  getCacheStrategyForPath,
  logCacheStrategy,
  shouldBypassCache,
} from './cache';
import { getPrivateEnvVars } from './env.server';

vi.mock('./env.server', () => ({
  getPrivateEnvVars: vi.fn(),
}));

const mockGetPrivateEnvVars = vi.mocked(getPrivateEnvVars);

const mockEnv = (readContentFrom: 'locale' | 'github') =>
  mockGetPrivateEnvVars.mockReturnValue({
    readContentFrom,
  } as ReturnType<typeof getPrivateEnvVars>);

function makeRequest(url: string): Request {
  return new Request(url);
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('shouldBypassCache', () => {
  it('returns true when ?refresh is present (no value)', () => {
    expect(
      shouldBypassCache(makeRequest('https://example.com/page?refresh')),
    ).toBe(true);
  });

  it('returns true when ?refresh=1 is present', () => {
    expect(
      shouldBypassCache(makeRequest('https://example.com/page?refresh=1')),
    ).toBe(true);
  });

  it('returns true when ?refresh=0 (key presence, not value)', () => {
    expect(
      shouldBypassCache(makeRequest('https://example.com/page?refresh=0')),
    ).toBe(true);
  });

  it('returns false when ?refresh is absent', () => {
    expect(
      shouldBypassCache(makeRequest('https://example.com/page?other=1')),
    ).toBe(false);
  });
});

describe('getCacheHeaders', () => {
  describe('bypass mode', () => {
    it('returns no-store headers regardless of strategy when bypassCache=true', () => {
      const headers = getCacheHeaders('blogPost', true);
      expect(headers['Cache-Control']).toBe(
        'no-cache, no-store, must-revalidate',
      );
      expect(headers['Vercel-CDN-Cache-Control']).toBe(
        'no-cache, no-store, must-revalidate',
      );
    });
  });

  describe('locale content source', () => {
    beforeEach(() => mockEnv('locale'));

    it('returns no headers — no CDN in locale mode', () => {
      const headers = getCacheHeaders('blogPost');
      expect(headers).toEqual({});
    });

    it('returns no headers for any strategy', () => {
      expect(getCacheHeaders('static')).toEqual({});
      expect(getCacheHeaders('story')).toEqual({});
      expect(getCacheHeaders('job')).toEqual({});
    });
  });

  describe('GitHub content source', () => {
    beforeEach(() => mockEnv('github'));

    it.each([
      ['blogPost', 's-maxage=3600, stale-while-revalidate=86400'],
      ['story', 's-maxage=3600, stale-while-revalidate=86400'],
      ['job', 's-maxage=3600, stale-while-revalidate=86400'],
      ['static', 's-maxage=86400, stale-while-revalidate=604800'],
    ] as const)(
      '%s strategy emits correct Cache-Control headers',
      (strategy, expected) => {
        const headers = getCacheHeaders(strategy);
        expect(headers).toEqual({
          'Cache-Control': expected,
          'Vercel-CDN-Cache-Control': expected,
          Vary: 'Accept-Language',
        });
      },
    );
  });

  describe('when getPrivateEnvVars throws (env not configured)', () => {
    beforeEach(() => {
      mockGetPrivateEnvVars.mockImplementation(() => {
        throw new Error('env not configured');
      });
    });

    it('falls back to empty headers (treats as locale source)', () => {
      const headers = getCacheHeaders('static');
      expect(headers).toEqual({});
    });
  });
});

describe('getCacheStrategyForPath', () => {
  it('/blog/my-post → blogPost', () => {
    expect(getCacheStrategyForPath('/blog/my-post')).toBe('blogPost');
  });

  it('/blog → blogPost', () => {
    expect(getCacheStrategyForPath('/blog')).toBe('blogPost');
  });

  it('/clients/acme → story', () => {
    expect(getCacheStrategyForPath('/clients/acme')).toBe('story');
  });

  it('/ → static', () => {
    expect(getCacheStrategyForPath('/')).toBe('static');
  });

  it('/en/blog/post → blogPost (strips lang prefix)', () => {
    expect(getCacheStrategyForPath('/en/blog/post')).toBe('blogPost');
  });

  it('/fr/clients/corp → story (strips lang prefix)', () => {
    expect(getCacheStrategyForPath('/fr/clients/corp')).toBe('story');
  });

  it('/en/about → static', () => {
    expect(getCacheStrategyForPath('/en/about')).toBe('static');
  });

  it('/en (bare lang prefix) → static', () => {
    expect(getCacheStrategyForPath('/en')).toBe('static');
  });

  // Documents current prefix-match behaviour: /blogger matches /blog
  it('/blogger → blogPost (startsWith match, no route like this exists)', () => {
    expect(getCacheStrategyForPath('/blogger')).toBe('blogPost');
  });
});

describe('createHybridLoader', () => {
  it('returns fetcher result unchanged', async () => {
    const data = { title: 'hello' };
    const fetcher = vi.fn().mockResolvedValue(data);
    const loader = createHybridLoader(fetcher);
    const args = {
      request: makeRequest('https://example.com/'),
    } as Parameters<typeof fetcher>[0];

    const result = await loader(args);

    expect(result).toBe(data);
    expect(fetcher).toHaveBeenCalledWith(args);
  });

  it('propagates fetcher rejection', async () => {
    const err = new Error('boom');
    const loader = createHybridLoader(vi.fn().mockRejectedValue(err));
    await expect(
      loader({
        request: makeRequest('https://example.com/'),
      } as Parameters<ReturnType<typeof createHybridLoader>>[0]),
    ).rejects.toBe(err);
  });

  it('strategy argument is a no-op (backward-compat stub)', async () => {
    const data = { ok: true };
    const fetcher = vi.fn().mockResolvedValue(data);
    const loaderWithStrategy = createHybridLoader(fetcher, 'blogPost');
    const loaderNoStrategy = createHybridLoader(fetcher);
    const args = {
      request: makeRequest('https://example.com/'),
    } as Parameters<typeof fetcher>[0];

    expect(await loaderWithStrategy(args)).toEqual(
      await loaderNoStrategy(args),
    );
  });
});

describe('logCacheStrategy', () => {
  it('logs Vercel Edge Cache when using github source', () => {
    mockEnv('github');
    const spy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    logCacheStrategy();
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('Vercel Edge Cache'),
    );
    spy.mockRestore();
  });

  it('logs local filesystem when using locale source', () => {
    mockEnv('locale');
    const spy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    logCacheStrategy();
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('local filesystem'),
    );
    spy.mockRestore();
  });
});
