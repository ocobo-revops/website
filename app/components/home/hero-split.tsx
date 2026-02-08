import type React from 'react';

import { css } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';

type GapSize = 6 | 8 | 10 | 12 | 16;

interface HeroSplitProps {
  children: React.ReactNode;
  gap?: GapSize;
  className?: string;
}

interface SubComponentProps {
  children: React.ReactNode;
  className?: string;
}

const HeroSplitRoot: React.FC<HeroSplitProps> = ({
  children,
  gap = 12,
  className = '',
}) => {
  return (
    <div
      className={`${flex({
        direction: { base: 'column', lg: 'row' },
        align: { lg: 'center' },
        gap: { base: String(gap), lg: String(gap) },
      })} ${className}`}
    >
      {children}
    </div>
  );
};

const Content: React.FC<SubComponentProps> = ({ children, className = '' }) => {
  return <div className={`${css({ flex: '1' })} ${className}`}>{children}</div>;
};

const Media: React.FC<SubComponentProps> = ({ children, className = '' }) => {
  return <div className={`${css({ flex: '1' })} ${className}`}>{children}</div>;
};

export const HeroSplit = Object.assign(HeroSplitRoot, {
  Content,
  Media,
});
