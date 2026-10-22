/**
 * Challenge list behind the navbar entry and the sitemap (#237), kept in
 * memory per language. Every page render needs it, and the GitHub source
 * costs one listing plus one call per file: the HTTP layer does not cache
 * those calls on Node.
 *
 * The cache lives in each server instance. `?refresh=1` refreshes only the
 * instance that serves that request; the others refresh at their own TTL.
 */

import type { Language } from '~/localization/resources';

import { type ChallengeMenuEntry, toChallengeMenu } from './challenge-menu';
import { fetchValidChallenges } from './content/api';
import { getContentSource } from './env.server';

/** How long a list is served before the next render fetches it again. */
export const CHALLENGE_MENU_TTL_MS = 5 * 60 * 1000;

/** How long a failed fetch waits before the next one. */
export const CHALLENGE_MENU_RETRY_MS = 30 * 1000;

export type ChallengeMenuLoad = {
  challenges: ChallengeMenuEntry[];
  /** True when the list could not be fetched: `challenges` may be outdated. */
  failed: boolean;
};

type CachedList = ChallengeMenuLoad & { expiresAt: number };

const cache = new Map<Language, CachedList>();
const inflight = new Map<Language, Promise<ChallengeMenuLoad>>();

type LoadOptions = {
  /** Fetch even when the cached list is fresh (`?refresh=1`). */
  refresh?: boolean;
};

/**
 * Published challenges of one language, in `order`. Never throws: a failed
 * fetch serves the last list fetched, or `[]` before any, and waits
 * `CHALLENGE_MENU_RETRY_MS` before the next try. Concurrent renders share
 * one fetch. The local filesystem source is read on every call, so edits
 * show at once.
 */
export async function loadChallengeMenu(
  lang: Language,
  { refresh = false }: LoadOptions = {},
): Promise<ChallengeMenuLoad> {
  const cacheable = getContentSource() === 'github';
  if (!cacheable) {
    return fetchChallengeMenu(lang);
  }

  const cached = cache.get(lang);
  if (cached && !refresh && cached.expiresAt > Date.now()) {
    return { challenges: cached.challenges, failed: cached.failed };
  }

  const pending = inflight.get(lang);
  if (pending && !refresh) {
    return pending;
  }

  const load: Promise<ChallengeMenuLoad> = fetchChallengeMenu(lang).then(
    (result) => {
      // Read the previous list now, not when the fetch started.
      const served = result.failed
        ? { challenges: cache.get(lang)?.challenges ?? [], failed: true }
        : result;
      // A refresh started after this fetch owns the cache: keep its list.
      if (inflight.get(lang) === load) {
        cache.set(lang, {
          ...served,
          expiresAt:
            Date.now() +
            (served.failed ? CHALLENGE_MENU_RETRY_MS : CHALLENGE_MENU_TTL_MS),
        });
      }
      return served;
    },
  );
  inflight.set(lang, load);
  try {
    return await load;
  } finally {
    if (inflight.get(lang) === load) {
      inflight.delete(lang);
    }
  }
}

async function fetchChallengeMenu(lang: Language): Promise<ChallengeMenuLoad> {
  const [status, state, files] = await fetchValidChallenges(lang).catch(
    (error: unknown) => {
      console.error('[challenge-menu] challenge list threw:', error);
      return [500, 'source_error', undefined] as const;
    },
  );
  // A missing folder is the normal state before any challenge is published.
  if ((status === 200 && files) || state === 'not_found') {
    return {
      challenges: files ? toChallengeMenu(files) : [],
      failed: false,
    };
  }

  console.error('[challenge-menu] challenge list unavailable:', status, state);
  return { challenges: [], failed: true };
}
