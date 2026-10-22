import { useSyncExternalStore } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function getMediaQuery(): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function')
    return null;
  return window.matchMedia(REDUCED_MOTION_QUERY);
}

/**
 * Reads the visitor's reduced motion preference right now. Returns false on
 * the server. Safe to call inside effects, before the hook value has synced.
 */
export function matchesReducedMotion(): boolean {
  return getMediaQuery()?.matches ?? false;
}

function subscribe(onChange: () => void): () => void {
  const query = getMediaQuery();
  if (!query) return () => undefined;
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

const getServerSnapshot = () => false;

/**
 * True when the visitor asks for reduced motion. The server render and the
 * hydration pass read false, then the hook follows the media query live.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    matchesReducedMotion,
    getServerSnapshot,
  );
}
