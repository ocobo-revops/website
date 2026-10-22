import {
  Blocks,
  Coins,
  HeartHandshake,
  type LucideIcon,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router';

import type { Color, NavItem } from '~/components/navbar/types';
import type { ChallengeKey } from '~/modules/challenge-schema';
import type { loader as mainLoader } from '~/routes/_main';

import { useLocalizedPathname } from './useLocalizedPathname';

/** Route id of `app/routes/_main.tsx`, which loads the list. */
export const MAIN_ROUTE_ID = 'routes/_main';

/**
 * Closest navbar palette colour to each challenge's `challenge.<key>` token
 * in `preset/semantic-tokens.ts`.
 */
const challengeColor: Record<ChallengeKey, Color> = {
  rp: 'coral',
  se: 'mint',
  sc: 'yellow',
  cx: 'sky',
  sy: 'gray',
  ai: 'coral',
};

const challengeIcon: Record<ChallengeKey, LucideIcon> = {
  rp: TrendingUp,
  se: Users,
  sc: Coins,
  cx: HeartHandshake,
  sy: Blocks,
  ai: Sparkles,
};

/**
 * Challenge entry of the navbar (#237): one item per published challenge in
 * the current language, or `null` when there is none, which hides it.
 */
export function useChallengeMenuItem(): NavItem | null {
  const { t } = useTranslation('common');
  const getLocalizedPath = useLocalizedPathname();
  const challenges =
    useRouteLoaderData<typeof mainLoader>(MAIN_ROUTE_ID)?.challenges ?? [];

  if (challenges.length === 0) {
    return null;
  }

  return {
    key: 'challenges',
    label: t('navigation.challenges.title'),
    path: null,
    dropdown: challenges.map(({ slug, key, name, tagline }) => ({
      key: slug,
      label: name,
      description: tagline ?? undefined,
      path: getLocalizedPath(`/challenges/${slug}`),
      icon: challengeIcon[key],
      color: challengeColor[key],
    })),
  };
}
