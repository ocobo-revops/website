import type React from 'react';

import { css, cx } from '@ocobo/styled-system/css';
import { badge, text } from '@ocobo/styled-system/recipes';

type BadgeVariant = 'yellow' | 'sky' | 'mint' | 'coral';

interface SectionHeaderProps {
  badgeText?: string;
  badgeVariant?: BadgeVariant;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  light?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badgeText,
  badgeVariant = 'yellow',
  title,
  subtitle,
  centered = true,
  className = '',
  light = false,
}) => {
  const titleTextColor: 'white' | 'dark' = light ? 'white' : 'dark';
  const subtitleColor = light ? 'gray.300' : 'gray.600';

  return (
    <div
      className={`${css({
        textAlign: centered ? 'center' : 'left',
      })} ${className}`}
    >
      {badgeText ? (
        <span
          className={`${badge({ variant: badgeVariant })} ${css({ mb: '8' })}`}
        >
          {badgeText}
        </span>
      ) : null}
      <h2
        className={cx(
          text({ variant: 'display-section', color: titleTextColor }),
          css({ mb: '6' }),
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={css({
            fontSize: { base: 'lg', md: 'xl' },
            color: subtitleColor,
            fontWeight: 'medium',
          })}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
};
