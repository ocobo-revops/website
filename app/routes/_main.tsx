import {
  type LoaderFunctionArgs,
  Outlet,
  type ShouldRevalidateFunction,
  useNavigation,
} from 'react-router';

import { css } from '@ocobo/styled-system/css';

import { ErrorMessage } from '~/components/ErrorMessage';
import { LayoutMain } from '~/components/LayoutMain';
import { createHybridLoader, shouldBypassCache } from '~/modules/cache';
import { didChallengeLoadFail } from '~/modules/challenge-menu-state';
import { loadChallengeMenu } from '~/modules/challenge-menu.server';
import { isPageEnabled } from '~/modules/feature-flags';
import { getLang, getLangParam } from '~/utils/lang';

/**
 * Layout data shared by every page: the navbar challenge entry (#237). The
 * entry is hidden, and the page still renders, when the `challenges` page is
 * disabled (no fetch then), when the fetch fails or when it finds nothing.
 * The list is cached in memory per language (`challenge-menu.server.ts`);
 * `?refresh=1` fetches it again.
 */
export const loader = createHybridLoader(
  async ({ params, request }: LoaderFunctionArgs) => {
    if (!isPageEnabled('challenges')) {
      return { challenges: [], failed: false };
    }
    return loadChallengeMenu(getLang(params), {
      refresh: shouldBypassCache(request),
    });
  },
);

/**
 * The list depends on the language only: skip the reload on client
 * navigations within one language, unless the last load failed. A failed
 * load is retried on the next navigation; the server waits
 * `CHALLENGE_MENU_RETRY_MS` between fetches after a failure.
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentParams,
  nextParams,
}) =>
  getLangParam(currentParams) !== getLangParam(nextParams) ||
  didChallengeLoadFail();

export function ErrorBoundary() {
  return (
    <LayoutMain>
      <ErrorMessage />
    </LayoutMain>
  );
}

export default function Index() {
  const navigation = useNavigation();
  return (
    <LayoutMain>
      <div
        className={
          navigation.state === 'loading'
            ? css({
                opacity: '0.25',
                transition: 'opacity',
                transitionDuration: 'normal',
                transitionDelay: 'normal',
              })
            : ''
        }
      >
        <Outlet />
      </div>
    </LayoutMain>
  );
}
