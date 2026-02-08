import * as React from 'react';

import { css } from '@ocobo/styled-system/css';

import { Footer } from '~/components/Footer';
import { Navbar } from '~/components/navbar/navbar';

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
      <Navbar />
      <div
        className={css({
          pt: { base: '24', md: '28', lg: '32' },
        })}
      >
        <React.Suspense fallback={<Loader className={css({ h: '300px' })} />}>
          {children}
        </React.Suspense>
      </div>
      <Footer />
    </div>
  );
}
