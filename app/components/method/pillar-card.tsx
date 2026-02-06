import type { LucideIcon } from 'lucide-react';
import type React from 'react';

import { css, cx } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';

type ThemeColor = 'yellow' | 'mint' | 'sky' | 'coral' | 'dark';

type Deliverable = {
  title: string;
  description: string;
};

interface PillarCardProps {
  number: string;
  title: string;
  description: string;
  deliverables: Deliverable[];
  color?: ThemeColor;
  icon: LucideIcon;
  deliverablesLabel: string;
  className?: string;
}

const borderColorStyles: Record<ThemeColor, string> = {
  yellow: css({ borderTopColor: 'ocobo.yellow' }),
  mint: css({ borderTopColor: 'ocobo.mint' }),
  sky: css({ borderTopColor: 'ocobo.sky' }),
  coral: css({ borderTopColor: 'ocobo.coral' }),
  dark: css({ borderTopColor: 'ocobo.dark' }),
};

const iconBgStyles: Record<ThemeColor, string> = {
  yellow: css({ bg: 'ocobo.yellow.light', color: 'ocobo.yellow' }),
  mint: css({ bg: 'ocobo.mint.light', color: 'ocobo.mint' }),
  sky: css({ bg: 'ocobo.sky.light', color: 'ocobo.sky' }),
  coral: css({ bg: 'ocobo.coral.light', color: 'ocobo.coral' }),
  dark: css({ bg: 'gray.200', color: 'ocobo.dark' }),
};

const bulletStyles: Record<ThemeColor, string> = {
  yellow: css({
    bg: 'ocobo.yellow',
    ring: '4px',
    ringColor: 'ocobo.yellow.light',
  }),
  mint: css({ bg: 'ocobo.mint', ring: '4px', ringColor: 'ocobo.mint.light' }),
  sky: css({ bg: 'ocobo.sky', ring: '4px', ringColor: 'ocobo.sky.light' }),
  coral: css({
    bg: 'ocobo.coral',
    ring: '4px',
    ringColor: 'ocobo.coral.light',
  }),
  dark: css({ bg: 'ocobo.dark', ring: '4px', ringColor: 'gray.200' }),
};

export const PillarCard: React.FC<PillarCardProps> = ({
  number,
  title,
  description,
  deliverables,
  deliverablesLabel,
  color = 'yellow',
  icon: Icon,
  className = '',
}) => {
  return (
    <div
      className={cx(
        css({
          bg: 'white',
          p: '8',
          borderTopWidth: '8px',
          shadow: 'card',
          transition: 'all',
          transitionDuration: '300ms',
          position: 'relative',
          _hover: { shadow: 'xl', transform: 'translateY(-4px)' },
        }),
        borderColorStyles[color],
        className,
      )}
    >
      <div
        className={`${flex({ justify: 'space-between', align: 'flex-start' })} ${css(
          {
            mb: '10',
          },
        )}`}
      >
        <div
          className={cx(css({ p: '4', rounded: 'full' }), iconBgStyles[color])}
        >
          <Icon size={32} />
        </div>
        <span
          className={css({
            fontSize: '6xl',
            fontFamily: 'display',
            fontWeight: 'bold',
            color: 'gray.100/60',
            lineHeight: 'none',
            userSelect: 'none',
          })}
        >
          {number}
        </span>
      </div>

      <h3
        className={css({
          fontFamily: 'display',
          fontSize: '3xl',
          fontWeight: 'bold',
          mb: '6',
        })}
      >
        {title}
      </h3>

      <p
        className={css({
          color: 'gray.600',
          mb: '10',
          lineHeight: 'relaxed',
          fontWeight: 'medium',
        })}
      >
        {description}
      </p>

      <div
        className={css({
          bg: 'gray.50/50',
          p: '8',
          rounded: '2xl',
          borderWidth: '1px',
          borderColor: 'gray.100',
        })}
      >
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: 'xs',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'ocobo.dark/40',
            display: 'block',
            mb: '6',
          })}
        >
          {deliverablesLabel}
        </span>
        <div className={css({ spaceY: '6' })}>
          {deliverables.map((deliverable, index) => (
            <div
              key={`${deliverable.title}-${index}`}
              className={flex({ gap: '4', align: 'flex-start' })}
            >
              <div
                className={cx(
                  css({
                    mt: '1.5',
                    w: '2',
                    h: '2',
                    rounded: 'full',
                    flexShrink: 0,
                  }),
                  bulletStyles[color],
                )}
              />
              <div>
                <h4
                  className={css({
                    fontSize: 'base',
                    fontWeight: 'bold',
                    color: 'ocobo.dark',
                    mb: '1',
                    lineHeight: 'snug',
                  })}
                >
                  {deliverable.title}
                </h4>
                <p
                  className={css({
                    fontSize: 'sm',
                    color: 'gray.500',
                    lineHeight: 'relaxed',
                  })}
                >
                  {deliverable.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
