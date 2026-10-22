import { NavLink } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import { designSystemSubpages } from './subpages';

const list = css({ display: 'flex', flexWrap: 'wrap', gap: '2' });

// `NavLink` sets `aria-current="page"` on the current subpage; the border
// marks it apart from hover, beyond colour alone.
const linkStyles = cx(
  text({ variant: 'small' }),
  css({
    display: 'inline-flex',
    px: '4',
    py: '2',
    rounded: 'full',
    border: 'thin',
    borderColor: 'line',
    color: 'gray',
    transition: 'colors',
    _hover: { bg: 'gray.light', color: 'foreground' },
    '&[aria-current="page"]': {
      bg: 'gray.light',
      color: 'foreground',
      borderColor: 'foreground',
    },
    _focusVisible: {
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: 'foreground',
      outlineOffset: '0.5',
    },
  }),
);

const links = [
  { to: '/design-system', title: 'Overview' },
  ...designSystemSubpages,
];

/** Links between the `/design-system` index and its subpages. */
export function SubpageNav() {
  return (
    <nav aria-label="Design system">
      <ul className={list}>
        {links.map(({ to, title }) => (
          <li key={to}>
            <NavLink to={to} end className={linkStyles}>
              {title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
