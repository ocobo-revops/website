import type { Language } from '~/localization/resources';

import { fetchValidChallenges } from './content/api';
import { isPageEnabled } from './feature-flags';
import {
  type HomeChallengeCard,
  toHomeChallengeCards,
} from './home-challenges';

/**
 * Published challenges of one language for the home cards (#241), in
 * `order`. Never throws: the home renders without cards when the challenge
 * pages are disabled (no fetch then), when no challenge is published, or
 * when the list fails.
 */
export async function loadHomeChallenges(
  lang: Language,
): Promise<HomeChallengeCard[]> {
  if (!isPageEnabled('challenges')) {
    return [];
  }

  const [status, state, files] = await fetchValidChallenges(lang).catch(
    (error: unknown) => {
      console.error('[home-challenges] challenge list threw:', error);
      return [500, 'source_error', undefined] as const;
    },
  );
  if (status === 200 && files) {
    return toHomeChallengeCards(files);
  }
  // A missing folder is the normal state before any challenge is published.
  if (state !== 'not_found') {
    console.error(
      '[home-challenges] challenge list unavailable:',
      status,
      state,
    );
  }
  return [];
}
