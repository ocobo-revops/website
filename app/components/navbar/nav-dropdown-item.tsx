import * as React from 'react';

import { ExternalLink } from 'lucide-react';
import { NavLink } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { center, flex } from '@ocobo/styled-system/patterns';

import { hoverStyles, hoverTextStyles, iconStyles } from './styles';
import type { DropdownItem } from './types';

type NavDropdownItemProps = React.ComponentPropsWithoutRef<'a'> & {
  item: DropdownItem;
  onClose?: () => void;
};

export const NavDropdownItem = React.forwardRef<
  HTMLAnchorElement,
  NavDropdownItemProps
>(function NavDropdownItem({ item, onClose, ...props }, ref) {
  const {
    label,
    description,
    path,
    icon: Icon,
    imageSrc,
    color,
    isExternal,
  } = item;

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
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={label}
            className={css({ w: '4', h: '4', objectFit: 'contain' })}
          />
        ) : (
          Icon && <Icon size={16} />
        )}
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
        ref={ref}
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        className={itemClass}
        onClick={onClose}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <NavLink
      ref={ref}
      to={path}
      className={itemClass}
      onClick={onClose}
      {...props}
    >
      {content}
    </NavLink>
  );
});
