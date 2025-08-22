/**
 * Simplified cache strategy for API-first architecture
 */
import { getPrivateEnvVars } from './env.server';

export type CacheStrategy =
  | 'blogListing'
  | 'blogPost'
  | 'storyListing'
  | 'story'
  | 'static';

// BALANCED: Aggressive cache for individual content, shorter for listings to show new content
const CACHE_CONFIG = {
  // Blog post listings: Short cache to show new articles quickly
  blogListing: { maxAge: 3600, staleWhileRevalidate: 7200 }, // 1h + 2h
  // Individual blog posts: Long cache since content doesn't change once published
  blogPost: { maxAge: 604800, staleWhileRevalidate: 1209600 }, // 7d + 14d

  // Story listings: Short cache to show new stories quickly
  storyListing: { maxAge: 3600, staleWhileRevalidate: 7200 }, // 1h + 2h
  // Individual stories: Long cache since content doesn't change once published
  story: { maxAge: 1209600, staleWhileRevalidate: 2592000 }, // 14d + 30d

  // Static content: cache for 30 days + 60 days stale = 90 days total
  static: { maxAge: 2592000, staleWhileRevalidate: 5184000 }, // 30d + 60d
} as const;

function isUsingGitHub(): boolean {
  try {
    const { readContentFrom } = getPrivateEnvVars();
    return readContentFrom === 'github';
  } catch {
    return false;
  }
}

export function shouldBypassCache(request: Request): boolean {
  const url = new URL(request.url);
  return url.searchParams.has('refresh');
}

function buildCacheControl(strategy: CacheStrategy): string {
  const { maxAge, staleWhileRevalidate } = CACHE_CONFIG[strategy];
  return `s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`;
}

/**
 * Cache headers for API routes (data caching)
 */
export function getApiCacheHeaders(
  strategy: CacheStrategy,
  bypassCache = false,
) {
  if (bypassCache) {
    return {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Vercel-CDN-Cache-Control': 'no-cache, no-store, must-revalidate',
    };
  }

  if (isUsingGitHub()) {
    const cacheControl = buildCacheControl(strategy);
    return {
      'Cache-Control': cacheControl,
      'Vercel-CDN-Cache-Control': cacheControl,
      Vary: 'Accept-Language',
    };
  }

  return {
    'Cache-Control': 'no-cache',
    'Vercel-CDN-Cache-Control': 'no-cache',
  };
}

/**
 * Cache headers for HTML pages (rendering caching)
 * Shorter cache for faster content updates
 */
export function getHtmlCacheHeaders(bypassCache = false) {
  if (bypassCache) {
    return {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Vercel-CDN-Cache-Control': 'no-cache, no-store, must-revalidate',
    };
  }

  if (isUsingGitHub()) {
    return {
      'Cache-Control': 's-maxage=300, stale-while-revalidate=3600', // 5min + 1h
      'Vercel-CDN-Cache-Control': 's-maxage=300, stale-while-revalidate=3600',
      Vary: 'Accept-Language',
    };
  }

  return {
    'Cache-Control': 'no-cache',
    'Vercel-CDN-Cache-Control': 'no-cache',
  };
}

// Removed deprecated functions:
// - createHybridLoader: Pages now use standard loaders calling API routes
// - getCacheHeaders: Replaced by getApiCacheHeaders/getHtmlCacheHeaders
// - getCacheStrategyForPath: HTML pages use unified HTML caching

export function logCacheStrategy(): void {
  const strategy = isUsingGitHub()
    ? 'Vercel Edge Cache'
    : 'No cache (local filesystem)';
  console.info(`🚀 Cache Strategy: ${strategy}`);
}
