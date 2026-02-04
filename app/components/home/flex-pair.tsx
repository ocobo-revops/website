import type React from 'react';

import { css } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';

type GapSize = 2 | 3 | 4 | 5 | 6 | 8;
type AlignItems = 'start' | 'center' | 'end';

interface FlexPairProps {
  children: React.ReactNode;
  gap?: GapSize;
  align?: AlignItems;
  className?: string;
}

interface SubComponentProps {
  children: React.ReactNode;
  className?: string;
}

const alignMap: Record<AlignItems, 'flex-start' | 'center' | 'flex-end'> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
};

const FlexPairRoot: React.FC<FlexPairProps> = ({
  children,
  gap = 4,
  align = 'start',
  className = '',
}) => {
  return (
    <div
      className={`${flex({
        gap: String(gap),
        align: alignMap[align],
      })} ${className}`}
    >
      {children}
    </div>
  );
};

const Icon: React.FC<SubComponentProps> = ({ children, className = '' }) => {
  return (
    <div className={`${css({ flexShrink: 0 })} ${className}`}>{children}</div>
  );
};

const Content: React.FC<SubComponentProps> = ({ children, className = '' }) => {
  return (
    <div className={`${css({ flex: '1', minW: '0' })} ${className}`}>
      {children}
    </div>
  );
};

export const FlexPair = Object.assign(FlexPairRoot, {
  Icon,
  Content,
});
