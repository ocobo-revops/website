import * as React from 'react';

import { css } from '@ocobo/styled-system/css';

import { FooterV2 } from '~/components/footer-v2/footer-v2';
import { NavbarV2 } from '~/components/navbar-v2/navbar';

import { Loader } from './ui/Loader';

type LayoutMainProps = React.PropsWithChildren<unknown>;

export function LayoutMain({ children }: LayoutMainProps) {
  return (
    <div
      className={css({
        color: 'foreground',
        bg: 'background',
        textStyle: 'medium',
      })}
    >
      <NavbarV2 />
      <div
        className={css({
          pt: { base: '24', md: '28', lg: '32' },
        })}
      >
        <React.Suspense fallback={<Loader className={css({ h: '[300px]' })} />}>
          {children}
        </React.Suspense>
      </div>
      <FooterV2 />
    </div>
  );
}
