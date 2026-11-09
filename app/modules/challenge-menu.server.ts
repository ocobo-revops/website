/**
 * Challenge list behind the navbar entry, the sitemap (#237) and the home
 * cards (#241), kept in memory per language as validated files. Every page render needs it, and the GitHub source
 * costs one listing plus one call per file: the HTTP layer does not cache
 * those calls on Node.
 *
 * The cache lives in each server instance. `?refresh=1` refreshes only the
 * instance that serves that request; the others refresh at their own TTL.
 */

import type { Language } from '~/localization/resources';

import type { MarkdocFile } from '~/types';

import { type ChallengeMenuEntry, toChallengeMenu } from './challenge-menu';
import type { ChallengeFrontmatter } from './challenge-schema';
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

export type ChallengeFilesLoad = {
  files: readonly MarkdocFile<ChallengeFrontmatter>[];
  /** True when the list could not be fetched: `files` may be outdated. */
  failed: boolean;
};

type CachedList = ChallengeFilesLoad & { expiresAt: number };

const cache = new Map<Language, CachedList>();
const inflight = new Map<Language, Promise<ChallengeFilesLoad>>();

type LoadOptions = {
  /** Fetch even when the cached list is fresh (`?refresh=1`). */
  refresh?: boolean;
};

/** Menu entries of one language, in `order`, from `loadChallengeFiles`. */
export async function loadChallengeMenu(
  lang: Language,
  options: LoadOptions = {},
): Promise<ChallengeMenuLoad> {
  const { files, failed } = await loadChallengeFiles(lang, options);
  return { challenges: toChallengeMenu(files), failed };
}

/**
 * Validated challenge files of one language. Never throws: a failed fetch
 * serves the last list fetched, or `[]` before any, and waits
 * `CHALLENGE_MENU_RETRY_MS` before the next try. Concurrent renders share
 * one fetch. The local filesystem source is read on every call, so edits
 * show at once.
 */
export async function loadChallengeFiles(
  lang: Language,
  { refresh = false }: LoadOptions = {},
): Promise<ChallengeFilesLoad> {
  const cacheable = getContentSource() === 'github';
  if (!cacheable) {
    return fetchChallengeFiles(lang);
  }

  const cached = cache.get(lang);
  if (cached && !refresh && cached.expiresAt > Date.now()) {
    return { files: cached.files, failed: cached.failed };
  }

  const pending = inflight.get(lang);
  if (pending && !refresh) {
    return pending;
  }

  const load: Promise<ChallengeFilesLoad> = fetchChallengeFiles(lang).then(
    (result) => {
      // Read the previous list now, not when the fetch started.
      const served = result.failed
        ? { files: cache.get(lang)?.files ?? [], failed: true }
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

async function fetchChallengeFiles(
  lang: Language,
): Promise<ChallengeFilesLoad> {
  const [status, state, files] = await fetchValidChallenges(lang).catch(
    (error: unknown) => {
      console.error('[challenge-menu] challenge list threw:', error);
      return [500, 'source_error', undefined] as const;
    },
  );
  // A missing folder is the normal state before any challenge is published.
  if ((status === 200 && files) || state === 'not_found') {
    return { files: files ?? [], failed: false };
  }

  console.error('[challenge-menu] challenge list unavailable:', status, state);
  return { files: [], failed: true };
}
