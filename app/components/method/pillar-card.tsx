import type { LucideIcon } from 'lucide-react';
import type React from 'react';

import { css } from '@ocobo/styled-system/css';
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

const borderColorMap: Record<ThemeColor, string> = {
  yellow: 'ocobo.yellow',
  mint: 'ocobo.mint',
  sky: 'ocobo.sky',
  coral: 'ocobo.coral',
  dark: 'ocobo.dark',
};

const iconBgMap: Record<ThemeColor, { bg: string; color: string }> = {
  yellow: { bg: 'ocobo.yellow.light', color: 'ocobo.yellow' },
  mint: { bg: 'ocobo.mint.light', color: 'ocobo.mint' },
  sky: { bg: 'ocobo.sky.light', color: 'ocobo.sky' },
  coral: { bg: 'ocobo.coral.light', color: 'ocobo.coral' },
  dark: { bg: 'gray.200', color: 'ocobo.dark' },
};

const bulletMap: Record<ThemeColor, { bg: string; ring: string }> = {
  yellow: { bg: 'ocobo.yellow', ring: 'ocobo.yellow.light' },
  mint: { bg: 'ocobo.mint', ring: 'ocobo.mint.light' },
  sky: { bg: 'ocobo.sky', ring: 'ocobo.sky.light' },
  coral: { bg: 'ocobo.coral', ring: 'ocobo.coral.light' },
  dark: { bg: 'ocobo.dark', ring: 'gray.200' },
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
  const iconStyle = iconBgMap[color];
  const bulletStyle = bulletMap[color];

  return (
    <div
      className={`${css({
        bg: 'white',
        p: '10',
        borderTopWidth: '8px',
        borderTopColor: borderColorMap[color],
        shadow: 'card',
        transition: 'all',
        transitionDuration: '300ms',
        position: 'relative',
        _hover: { shadow: 'xl', transform: 'translateY(-4px)' },
      })} ${className}`}
    >
      <div
        className={`${flex({ justify: 'space-between', align: 'flex-start' })} ${css(
          {
            mb: '10',
          },
        )}`}
      >
        <div
          className={css({
            p: '4',
            rounded: 'full',
            bg: iconStyle.bg,
            color: iconStyle.color,
          })}
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
                className={css({
                  mt: '1.5',
                  w: '2',
                  h: '2',
                  rounded: 'full',
                  flexShrink: 0,
                  bg: bulletStyle.bg,
                  ring: '4px',
                  ringColor: bulletStyle.ring,
                })}
              />
              <div>
                <h4
                  className={css({
                    fontSize: 'sm',
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
                    fontSize: 'xs',
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
