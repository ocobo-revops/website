import type { LucideIcon } from 'lucide-react';
import type React from 'react';

import { css, cx } from '@ocobo/styled-system/css';
import { center, hstack } from '@ocobo/styled-system/patterns';
import { text } from '@ocobo/styled-system/recipes';

type ThemeColor = 'yellow' | 'mint' | 'sky' | 'coral' | 'dark';

interface ScopeCardProps {
  title: string;
  items: string[];
  color?: ThemeColor;
  icon: LucideIcon;
  className?: string;
}

const iconBoxStyles: Record<ThemeColor, string> = {
  yellow: css({ bg: 'ocobo.yellow.light', color: 'ocobo.yellow' }),
  mint: css({ bg: 'ocobo.mint.light', color: 'ocobo.mint' }),
  sky: css({ bg: 'ocobo.sky.light', color: 'ocobo.sky' }),
  coral: css({ bg: 'ocobo.coral.light', color: 'ocobo.coral' }),
  dark: css({ bg: 'gray.200', color: 'ocobo.dark' }),
};

const bulletBgStyles: Record<ThemeColor, string> = {
  yellow: css({ bg: 'ocobo.yellow' }),
  mint: css({ bg: 'ocobo.mint' }),
  sky: css({ bg: 'ocobo.sky' }),
  coral: css({ bg: 'ocobo.coral' }),
  dark: css({ bg: 'ocobo.dark' }),
};

const hoverStyles: Record<ThemeColor, string> = {
  yellow: css({ _hover: { shadow: 'lg', borderColor: 'ocobo.yellow' } }),
  mint: css({ _hover: { shadow: 'lg', borderColor: 'ocobo.mint' } }),
  sky: css({ _hover: { shadow: 'lg', borderColor: 'ocobo.sky' } }),
  coral: css({ _hover: { shadow: 'lg', borderColor: 'ocobo.coral' } }),
  dark: css({ _hover: { shadow: 'lg', borderColor: 'ocobo.dark' } }),
};

export const ScopeCard: React.FC<ScopeCardProps> = ({
  title,
  items,
  color = 'yellow',
  icon: Icon,
  className = '',
}) => {
  return (
    <div
      className={cx(
        css({
          bg: 'white',
          borderWidth: '1px',
          borderColor: 'gray.100',
          p: '8',
          transition: 'all',
          transitionDuration: '300ms',
          rounded: 'xl',
        }),
        hoverStyles[color],
        className,
      )}
    >
      <div
        className={cx(
          center({ inline: true }),
          css({ w: '12', h: '12', rounded: 'lg', mb: '6', flexShrink: 0 }),
          iconBoxStyles[color],
        )}
      >
        <Icon size={24} />
      </div>
      <h3 className={cx(text({ variant: 'display-card' }), css({ mb: '4' }))}>
        {title}
      </h3>
      <ul className={css({ spaceY: '3', fontSize: 'sm', color: 'gray.600' })}>
        {items.map((item) => (
          <li key={item} className={hstack({ gap: '3' })}>
            <div
              className={cx(
                css({ w: '1.5', h: '1.5', rounded: 'full', flexShrink: 0 }),
                bulletBgStyles[color],
              )}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
