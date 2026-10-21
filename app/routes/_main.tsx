import { Outlet, useNavigation } from 'react-router';

import { css } from '@ocobo/styled-system/css';

import { ErrorMessage } from '~/components/ErrorMessage';
import { LayoutMain } from '~/components/LayoutMain';

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
