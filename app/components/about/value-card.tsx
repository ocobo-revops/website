import type React from 'react';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

type ThemeColor = 'yellow' | 'mint' | 'sky' | 'coral' | 'dark';

interface ValueCardProps {
  title: string;
  description: string;
  detail?: string;
  color?: ThemeColor;
  variant?: 'light' | 'dark';
  className?: string;
}

// Pre-computed static class strings so Panda CSS can extract all variants at build time
const titleTextClassMap: Record<ThemeColor, string> = {
  yellow: text({ variant: 'display-md-bold', color: 'yellow' }),
  mint: text({ variant: 'display-md-bold', color: 'mint' }),
  sky: text({ variant: 'display-md-bold', color: 'sky' }),
  coral: text({ variant: 'display-md-bold', color: 'coral' }),
  dark: text({ variant: 'display-md-bold', color: 'dark' }),
};

const titleTextDarkVariantClassMap: Record<ThemeColor, string> = {
  yellow: text({ variant: 'display-md-bold', color: 'yellow' }),
  mint: text({ variant: 'display-md-bold', color: 'mint' }),
  sky: text({ variant: 'display-md-bold', color: 'sky' }),
  coral: text({ variant: 'display-md-bold', color: 'coral' }),
  dark: text({ variant: 'display-md-bold', color: 'white' }),
};

export const ValueCard: React.FC<ValueCardProps> = ({
  title,
  description,
  detail,
  color = 'yellow',
  variant = 'light',
  className = '',
}) => {
  const titleTextClass =
    variant === 'dark'
      ? titleTextDarkVariantClassMap[color]
      : titleTextClassMap[color];
  const descriptionColor = variant === 'dark' ? 'gray.300' : 'gray.600';

  return (
    <div className={className}>
      <h3 className={cx(titleTextClass, css({ mb: '4' }))}>{title}</h3>
      <p className={css({ color: descriptionColor, lineHeight: 'relaxed' })}>
        {description}
      </p>
      {detail ? (
        <p
          className={css({
            fontSize: 'sm',
            color: 'gray.500',
            mt: '2',
            fontStyle: 'italic',
          })}
        >
          → {detail}
        </p>
      ) : null}
    </div>
  );
};
