import { Plus } from 'lucide-react';
import type React from 'react';

import { css, cx } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';
import { card, text } from '@ocobo/styled-system/recipes';

type ThemeColor = 'yellow' | 'mint' | 'sky' | 'coral' | 'dark';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  colour: ThemeColor;
  label?: string;
  className?: string;
}

const colourStyles: Record<ThemeColor, { bg: string; text: string }> = {
  yellow: { bg: 'ocobo.yellow.light', text: 'ocobo.yellow' },
  mint: { bg: 'ocobo.mint.light', text: 'ocobo.mint' },
  sky: { bg: 'ocobo.sky.light', text: 'ocobo.sky' },
  coral: { bg: 'ocobo.coral.light', text: 'ocobo.coral' },
  dark: { bg: 'gray.100', text: 'ocobo.dark' },
};

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  colour,
  label,
  className = '',
}) => {
  const styles = colourStyles[colour];

  return (
    <div
      className={cx(
        card({ padding: 'lg', radius: 'md', tone: 'white', border: true }),
        flex({
          direction: 'column',
          align: 'center',
          justify: 'center',
        }),
        css({
          position: 'relative',
          p: '12',
          aspectRatio: 'square',
          transition: 'all',
          transitionDuration: '500ms',
          textAlign: 'center',
          _hover: { shadow: 'soft-lg', transform: 'translateY(-8px)' },
        }),
        `group ${className}`,
      )}
    >
      <div
        className={css({
          position: 'absolute',
          inset: '0',
          bg: styles.bg,
          opacity: '0',
          rounded: '2xl',
          transition: 'opacity',
          transitionDuration: '300ms',
          _groupHover: { opacity: '0.1' },
        })}
      />

      <div
        className={css({
          mb: '8',
          color: styles.text,
          transition: 'all',
          transitionDuration: '500ms',
          _groupHover: { transform: 'scale(1.1) rotate(6deg)' },
        })}
      >
        {icon}
      </div>

      {label && (
        <span
          className={cx(
            text({ variant: 'label', color: 'dark' }),
            css({
              color: 'ocobo.dark/30',
              mb: '4',
            }),
          )}
        >
          {label}
        </span>
      )}

      <h3
        className={cx(
          text({ variant: 'display-lg', color: 'dark' }),
          css({
            fontSize: '4xl',
            mb: '3',
            letterSpacing: 'tighter',
            transition: 'colors',
            transitionDuration: '300ms',
            _groupHover: { color: styles.text },
          }),
        )}
      >
        {title}
      </h3>

      <p
        className={css({
          color: 'gray.400',
          fontWeight: 'bold',
          fontSize: 'sm',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
        })}
      >
        {description}
      </p>

      <div
        className={css({
          position: 'absolute',
          bottom: '6',
          opacity: '0',
          transition: 'opacity',
          transitionDuration: '300ms',
          _groupHover: { opacity: '0.2' },
        })}
      >
        <Plus size={20} className={css({ color: 'ocobo.dark' })} />
      </div>
    </div>
  );
};
