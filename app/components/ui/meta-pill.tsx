import type React from 'react';

import { css, cx } from '@ocobo/styled-system/css';
import { hstack } from '@ocobo/styled-system/patterns';

type MetaPillProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function MetaPill({ icon, children, className }: MetaPillProps) {
  return (
    <div
      className={cx(
        hstack({ gap: '2.5' }),
        css({
          px: '4',
          py: '2',
          bg: 'gray.50/50',
          borderWidth: '1px',
          borderColor: 'gray.100',
          rounded: 'full',
        }),
        className,
      )}
    >
      {icon}
      <span className={css({ color: 'ocobo.dark' })}>{children}</span>
    </div>
  );
}
