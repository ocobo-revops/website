import { ExternalLink } from 'lucide-react';
import { NavLink } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { center, flex } from '@ocobo/styled-system/patterns';

import type { Color, DropdownItem } from './types';

// Matching prototype styles exactly
const iconStyles: Record<Color, string> = {
  yellow: css({
    bg: 'ocobo.yellow/10',
    color: 'ocobo.yellow',
  }),
  sky: css({
    bg: 'ocobo.sky/10',
    color: 'ocobo.sky',
  }),
  coral: css({
    bg: 'ocobo.coral/10',
    color: 'ocobo.coral',
  }),
  mint: css({
    bg: 'ocobo.mint/10',
    color: 'ocobo.mint',
  }),
};

const hoverStyles: Record<Color, string> = {
  yellow: css({ _hover: { bg: 'ocobo.yellow.light' } }),
  sky: css({ _hover: { bg: 'ocobo.sky.light' } }),
  coral: css({ _hover: { bg: 'ocobo.coral.light' } }),
  mint: css({ _hover: { bg: 'ocobo.mint.light' } }),
};

const hoverTextStyles: Record<Color, string> = {
  yellow: css({ _groupHover: { color: 'ocobo.yellow' } }),
  sky: css({ _groupHover: { color: 'ocobo.sky' } }),
  coral: css({ _groupHover: { color: 'ocobo.coral' } }),
  mint: css({ _groupHover: { color: 'ocobo.mint' } }),
};

type NavDropdownItemProps = {
  item: DropdownItem;
  onClose?: () => void;
};

export function NavDropdownItem({ item, onClose }: NavDropdownItemProps) {
  const { label, description, path, icon: Icon, color, isExternal } = item;

  const content = (
    <>
      <div
        className={cx(
          center(),
          css({
            w: '10',
            h: '10',
            rounded: 'xl',
            flexShrink: 0,
            transition: 'all',
            _groupHover: { transform: 'scale(1.05)' },
          }),
          iconStyles[color],
        )}
      >
        {Icon && <Icon size={16} />}
      </div>
      <div
        className={css({
          transition: 'transform',
          _groupHover: { transform: 'translateX(4px)' },
        })}
      >
        <h4
          className={cx(
            css({
              fontWeight: 'bold',
              color: 'ocobo.dark',
              fontSize: 'base',
              mb: '0.5',
              transition: 'colors',
              display: 'flex',
              alignItems: 'center',
              gap: '1',
            }),
            hoverTextStyles[color],
          )}
        >
          {label}
          {isExternal && <ExternalLink size={12} />}
        </h4>
        {description && (
          <p
            className={css({
              fontSize: 'xs',
              color: 'gray.400',
              fontWeight: 'medium',
              lineHeight: 'tight',
            })}
          >
            {description}
          </p>
        )}
      </div>
    </>
  );

  const itemClass = cx(
    'group',
    flex({ gap: '4', align: 'flex-start' }),
    css({
      p: '4',
      rounded: '2xl',
      transition: 'all',
      cursor: 'pointer',
      outline: 'none',
      _focus: {
        outline: '2px solid',
        outlineColor: 'ocobo.dark',
        outlineOffset: '2px',
      },
    }),
    hoverStyles[color],
  );

  if (isExternal) {
    return (
      <a
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        className={itemClass}
        onClick={onClose}
      >
        {content}
      </a>
    );
  }

  return (
    <NavLink to={path} className={itemClass} onClick={onClose}>
      {content}
    </NavLink>
  );
}
