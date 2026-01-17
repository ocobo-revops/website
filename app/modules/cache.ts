/**
 * Cache strategy for React Router loaders
 *
 * - Local filesystem: No caching
 * - GitHub content: Vercel Edge Cache
 * - Testing: ?refresh=1 bypasses cache
 */

import type { LoaderFunctionArgs } from 'react-router';
import { getPrivateEnvVars } from './env.server';

/**
 * Cache strategy types for different content
 */
export type CacheStrategy = 'blogPost' | 'story' | 'offer' | 'static';

/**
 * Cache configuration for each strategy type
 */
const CACHE_CONFIG = {
  blogPost: { maxAge: 3600, staleWhileRevalidate: 86400 }, // 1h + 24h
  story: { maxAge: 3600, staleWhileRevalidate: 86400 }, // 1h + 24h
  offer: { maxAge: 3600, staleWhileRevalidate: 86400 }, // 1h + 24h
  static: { maxAge: 86400, staleWhileRevalidate: 604800 }, // 24h + 7d
} as const;

/**
 * Check if using GitHub as content source
 */
function isUsingGitHub(): boolean {
  try {
    const { readContentFrom } = getPrivateEnvVars();
    return readContentFrom === 'github';
  } catch {
    return false;
  }
}

/**
 * Check if request should bypass cache (refresh parameter)
 */
export function shouldBypassCache(request: Request): boolean {
  const url = new URL(request.url);
  return url.searchParams.has('refresh');
}

/**
 * Build cache control header based on strategy
 */
function buildCacheControl(strategy: CacheStrategy): string {
  const { maxAge, staleWhileRevalidate } = CACHE_CONFIG[strategy];
  return `s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`;
}

/**
 * Get cache headers for GitHub content or local filesystem
 */
export function getCacheHeaders(strategy: CacheStrategy, bypassCache = false) {
  if (bypassCache) {
    return {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Vercel-CDN-Cache-Control': 'no-cache, no-store, must-revalidate',
    };
  }

  if (isUsingGitHub()) {
    const cacheControl = buildCacheControl(strategy);
    return {
      // Standard header for browsers and other CDNs
      'Cache-Control': cacheControl,
      // Vercel-specific header (highest priority, Vercel-only)
      'Vercel-CDN-Cache-Control': cacheControl,
      Vary: 'Accept-Language',
    };
  }

  // Local filesystem: no caching
  return {
    'Cache-Control': 'no-cache',
    'Vercel-CDN-Cache-Control': 'no-cache',
  };
}

/**
 * Hybrid loader that returns data for meta functions with cache headers
 *
 * This is the main loader function used throughout the application.
 * It handles both data access (for meta functions) and caching.
 *
 * Note: Cache headers are now applied at the HTML response level in entry.server.tsx
 */
export function createHybridLoader<T>(
  fetcher: (args: LoaderFunctionArgs) => Promise<T>,
  _strategy?: CacheStrategy, // Keep for backward compatibility but no longer used
) {
  return async (args: LoaderFunctionArgs) => {
    const data = await fetcher(args);
    return data;
  };
}

/**
 * Determine cache strategy based on pathname
 */
export function getCacheStrategyForPath(pathname: string): CacheStrategy {
  // Remove language prefix if present
  const pathWithoutLang = pathname.replace(/^\/(en|fr)/, '') || '/';

  if (pathWithoutLang.startsWith('/blog')) {
    return 'blogPost';
  }

  if (pathWithoutLang.startsWith('/clients')) {
    return 'story';
  }

  if (pathWithoutLang.startsWith('/offers')) {
    return 'offer';
  }

  // Default to static for homepage and other pages
  return 'static';
}

/**
 * Log cache strategy being used on server startup
 */
export function logCacheStrategy(): void {
  const strategy = isUsingGitHub()
    ? 'Vercel Edge Cache'
    : 'No cache (local filesystem)';
  console.info(`🚀 Cache Strategy: ${strategy}`);
}
