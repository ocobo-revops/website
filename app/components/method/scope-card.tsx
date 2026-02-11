import type { LucideIcon } from 'lucide-react';
import type React from 'react';

import { css } from '@ocobo/styled-system/css';
import { center, hstack } from '@ocobo/styled-system/patterns';

type ThemeColor = 'yellow' | 'mint' | 'sky' | 'coral' | 'dark';

interface ScopeCardProps {
  title: string;
  items: string[];
  color?: ThemeColor;
  icon: LucideIcon;
  className?: string;
}

const iconBgStyles: Record<ThemeColor, { bg: string; color: string }> = {
  yellow: { bg: 'ocobo.yellow.light', color: 'ocobo.yellow' },
  mint: { bg: 'ocobo.mint.light', color: 'ocobo.mint' },
  sky: { bg: 'ocobo.sky.light', color: 'ocobo.sky' },
  coral: { bg: 'ocobo.coral.light', color: 'ocobo.coral' },
  dark: { bg: 'gray.200', color: 'ocobo.dark' },
};

const bulletStyles: Record<ThemeColor, string> = {
  yellow: 'ocobo.yellow',
  mint: 'ocobo.mint',
  sky: 'ocobo.sky',
  coral: 'ocobo.coral',
  dark: 'ocobo.dark',
};

const hoverBorderStyles: Record<ThemeColor, string> = {
  yellow: 'ocobo.yellow',
  mint: 'ocobo.mint',
  sky: 'ocobo.sky',
  coral: 'ocobo.coral',
  dark: 'ocobo.dark',
};

export const ScopeCard: React.FC<ScopeCardProps> = ({
  title,
  items,
  color = 'yellow',
  icon: Icon,
  className = '',
}) => {
  const iconStyle = iconBgStyles[color];

  return (
    <div
      className={`${css({
        bg: 'white',
        borderWidth: '1px',
        borderColor: 'gray.100',
        p: '8',
        transition: 'all',
        transitionDuration: '300ms',
        rounded: 'xl',
        _hover: { shadow: 'lg', borderColor: hoverBorderStyles[color] },
      })} ${className}`}
    >
      <div
        className={`${center({ inline: true })} ${css({
          w: '12',
          h: '12',
          rounded: 'lg',
          mb: '6',
          bg: iconStyle.bg,
          color: iconStyle.color,
          flexShrink: 0,
        })}`}
      >
        <Icon size={24} />
      </div>
      <h3
        className={css({
          fontFamily: 'display',
          fontSize: 'xl',
          fontWeight: 'bold',
          mb: '4',
        })}
      >
        {title}
      </h3>
      <ul className={css({ spaceY: '3', fontSize: 'sm', color: 'gray.600' })}>
        {items.map((item) => (
          <li key={item} className={hstack({ gap: '3' })}>
            <div
              className={css({
                w: '1.5',
                h: '1.5',
                rounded: 'full',
                flexShrink: 0,
                bg: bulletStyles[color],
              })}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
