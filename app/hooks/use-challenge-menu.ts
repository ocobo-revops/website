import { useRouteLoaderData } from 'react-router';

import {
  type ChallengeMenuEntry,
  MAIN_ROUTE_ID,
  otherChallenges,
} from '~/modules/challenge-menu';
import type { loader as mainLoader } from '~/routes/_main';

/**
 * The published challenges of the page language, as the `_main` layout
 * loads and caches them for the navbar (#237). Empty when the load failed
 * or the `challenges` page is disabled.
 */
export function useChallengeMenu(): {
  challenges: ChallengeMenuEntry[];
  failed: boolean;
} {
  const data = useRouteLoaderData<typeof mainLoader>(MAIN_ROUTE_ID);
  return { challenges: data?.challenges ?? [], failed: data?.failed ?? false };
}

/** Every published challenge except `currentSlug`, in `order`. */
export function useOtherChallenges(currentSlug: string): ChallengeMenuEntry[] {
  return otherChallenges(useChallengeMenu().challenges, currentSlug);
}
