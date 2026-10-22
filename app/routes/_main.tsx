import {
  type LoaderFunctionArgs,
  Outlet,
  type ShouldRevalidateFunction,
  useNavigation,
} from 'react-router';

import { css } from '@ocobo/styled-system/css';

import { ErrorMessage } from '~/components/ErrorMessage';
import { LayoutMain } from '~/components/LayoutMain';
import { createHybridLoader } from '~/modules/cache';
import { toChallengeMenu } from '~/modules/challenge-menu';
import { fetchChallenges } from '~/modules/content/api';
import { isPageEnabled } from '~/modules/feature-flags';
import { getLang } from '~/utils/lang';

/**
 * Layout data shared by every page: the navbar challenge entry (#237). The
 * entry is hidden, and the page still renders, when the `challenges` page is
 * disabled (no fetch then), when the fetch fails or when it finds nothing.
 */
export const loader = createHybridLoader(
  async ({ params }: LoaderFunctionArgs) => {
    if (!isPageEnabled('challenges')) {
      return { challenges: [] };
    }
    const [status, state, files] = await fetchChallenges(getLang(params));
    if (status === 200 && files) {
      return { challenges: toChallengeMenu(files) };
    }
    // A missing folder is the normal state before any challenge is published.
    if (state !== 'not_found') {
      console.error('[_main] challenge list unavailable:', status, state);
    }
    return { challenges: [] };
  },
);

/**
 * The list depends on the language only: skip the posts API call on client
 * navigations within one language. `defaultShouldRevalidate` is ignored on
 * purpose, so `revalidate()` and `?refresh=1` links on the client keep the
 * current list; a full page load fetches it again.
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentParams,
  nextParams,
}) => (currentParams.lang ?? 'fr') !== (nextParams.lang ?? 'fr');

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
