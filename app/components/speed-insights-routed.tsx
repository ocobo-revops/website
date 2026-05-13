import { SpeedInsights } from '@vercel/speed-insights/react';
import { useMatches } from 'react-router';

import { matchesToRoutePattern } from '~/utils/route-pattern';

/**
 * Vercel Speed Insights wrapper that reports the matched React Router route
 * pattern (e.g. `/:lang?/blog/:slug`) instead of the resolved pathname.
 *
 * Without this, every dynamic URL is bucketed as `Unknown` in the Routes tab.
 * The `($lang)` optional segment intentionally maps to `:lang?` so FR and EN
 * aggregate as a single pattern per page.
 */
export function SpeedInsightsRouted() {
  const matches = useMatches();
  const route = matchesToRoutePattern(matches);
  return <SpeedInsights route={route} />;
}
