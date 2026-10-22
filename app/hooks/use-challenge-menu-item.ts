import {
  Blocks,
  Coins,
  HeartHandshake,
  type LucideIcon,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router';

import { challengePalette } from '~/components/challenges/challenge-palette';
import type { NavItem } from '~/components/navbar/types';
import { MAIN_ROUTE_ID } from '~/modules/challenge-menu';
import { setChallengeLoadFailed } from '~/modules/challenge-menu-state';
import type { ChallengeKey } from '~/modules/challenge-schema';
import type { loader as mainLoader } from '~/routes/_main';

import { useLocalizedPathname } from './useLocalizedPathname';

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
  const data = useRouteLoaderData<typeof mainLoader>(MAIN_ROUTE_ID);
  const challenges = data?.challenges ?? [];
  const failed = data?.failed ?? false;

  useEffect(() => {
    setChallengeLoadFailed(failed);
  }, [failed]);

  if (challenges.length === 0) {
    return null;
  }

  return {
    key: 'challenges',
    label: t('navigation.challenges.title'),
    path: null,
    dropdown: challenges.map(({ slug, key, name, tagline }) => ({
      // Prefixed: the v2 footer picks its links by sub-item key ('blog').
      key: `challenge-${slug}`,
      label: name,
      description: tagline ?? undefined,
      path: getLocalizedPath(`/challenges/${slug}`),
      icon: challengeIcon[key],
      palette: challengePalette[key],
    })),
  };
}
