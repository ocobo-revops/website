import type { Language } from '~/localization/resources';

import { loadChallengeFiles } from './challenge-menu.server';
import {
  type HomeChallengeCard,
  toHomeChallengeCards,
} from './home-challenges';

/**
 * Published challenges of one language for the home cards (#241), in
 * `order`. Reads the list the navbar already keeps in memory, so the home
 * costs no extra fetch. Never throws: the home renders without cards when no
 * challenge is published, or when the list fails before any fetch succeeded.
 */
export async function loadHomeChallenges(
  lang: Language,
): Promise<HomeChallengeCard[]> {
  const { files } = await loadChallengeFiles(lang);
  return toHomeChallengeCards(files);
}
