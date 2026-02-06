import type React from 'react';

import { css } from '@ocobo/styled-system/css';
import { badge } from '@ocobo/styled-system/recipes';

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
  const titleColor = light ? 'white' : 'ocobo.dark';
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
        className={css({
          fontFamily: 'display',
          fontSize: { base: '3xl', md: '5xl' },
          fontWeight: 'bold',
          color: titleColor,
          mb: '6',
          lineHeight: 'tight',
        })}
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
