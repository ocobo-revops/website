import { NavLink } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { center } from '@ocobo/styled-system/patterns';
import { text } from '@ocobo/styled-system/recipes';

import type { DropdownItem } from '~/components/navbar/types';

import { focusRing, iconTint, itemHoverTint } from './nav-styles';

type NavPanelItemProps = {
  item: DropdownItem;
  onSelect?: () => void;
};

const itemStyles = css({
  display: 'flex',
  gap: '4',
  alignItems: 'flex-start',
  p: '4',
  rounded: '2xl',
  color: 'dark',
  textDecoration: 'none',
  transition: 'all',
  '&:hover .nav-item-icon': { transform: 'scale(1.05)' },
  '&:hover .nav-item-text': { transform: 'translateX(4px)' },
  _motionReduce: {
    '&:hover .nav-item-icon, &:hover .nav-item-text': { transform: 'none' },
  },
});

/**
 * One entry of a desktop panel or a mobile accordion group: tinted icon
 * box, title and optional description.
 */
export function NavPanelItem({ item, onSelect }: NavPanelItemProps) {
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
      <span
        aria-hidden="true"
        className={cx(
          'nav-item-icon',
          center(),
          css({
            w: '10',
            h: '10',
            flexShrink: 0,
            rounded: 'xl',
            transition: 'transform',
          }),
          iconTint[color],
        )}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt=""
            className={css({ w: '5', h: '5', objectFit: 'contain' })}
          />
        ) : (
          Icon && <Icon size={18} />
        )}
      </span>
      <span
        className={cx(
          'nav-item-text',
          css({
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5',
            transition: 'transform',
          }),
        )}
      >
        <span
          className={cx(
            text({ variant: 'body' }),
            css({ fontWeight: 'bold', lineHeight: 'tight' }),
          )}
        >
          {label}
        </span>
        {description && (
          <span
            className={css({
              fontSize: 'caption',
              fontWeight: 'medium',
              color: 'gray.500',
            })}
          >
            {description}
          </span>
        )}
      </span>
    </>
  );

  const className = cx(itemStyles, itemHoverTint[color], focusRing);

  if (isExternal) {
    return (
      <a
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onSelect}
      >
        {content}
      </a>
    );
  }

  return (
    <NavLink to={path} className={className} onClick={onSelect}>
      {content}
    </NavLink>
  );
}
