import type React from 'react';

import { css } from '@ocobo/styled-system/css';

type ThemeColor = 'yellow' | 'mint' | 'sky' | 'coral' | 'dark';

interface ValueCardProps {
  title: string;
  description: string;
  detail?: string;
  color?: ThemeColor;
  variant?: 'light' | 'dark';
  className?: string;
}

const titleColorMap: Record<ThemeColor, string> = {
  yellow: 'ocobo.yellow',
  mint: 'ocobo.mint',
  sky: 'ocobo.sky',
  coral: 'ocobo.coral',
  dark: 'ocobo.dark',
};

export const ValueCard: React.FC<ValueCardProps> = ({
  title,
  description,
  detail,
  color = 'yellow',
  variant = 'light',
  className = '',
}) => {
  const titleColor =
    color === 'dark' && variant === 'dark' ? 'white' : titleColorMap[color];
  const descriptionColor = variant === 'dark' ? 'gray.300' : 'gray.600';

  return (
    <div className={className}>
      <h3
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: '2xl',
          mb: '4',
          color: titleColor,
        })}
      >
        {title}
      </h3>
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
