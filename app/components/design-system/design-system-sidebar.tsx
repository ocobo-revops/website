import { NavLink } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import {
  designSystemGroups,
  designSystemPagePath,
  designSystemRoot,
} from './subpages';

// Group links wrap in rows above the content on small screens, and stack in
// a column beside it from `lg`.
const list = css({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: { lg: 'column' },
  gap: '1',
});
const groupLabel = cx(
  text({ variant: 'label' }),
  css({ color: 'gray', mt: '5', mb: '2', px: '3' }),
);

// `NavLink` sets `aria-current="page"` on the current page. The weight, and
// the left bar from `lg`, mark it apart from hover beyond colour alone.
const linkStyles = cx(
  text({ variant: 'small' }),
  css({
    display: 'block',
    px: '3',
    py: '1.5',
    rounded: 'lg',
    color: 'gray',
    lg: {
      roundedLeft: 'none',
      borderLeftWidth: '2px',
      borderLeftStyle: 'solid',
      borderLeftColor: 'transparent',
    },
    transition: 'colors',
    _hover: { bg: 'gray.light', color: 'foreground' },
    '&[aria-current="page"]': {
      bg: 'gray.light',
      color: 'foreground',
      fontWeight: 'semibold',
      borderLeftColor: 'foreground',
    },
    _focusVisible: {
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: 'foreground',
      outlineOffset: '0.5',
    },
  }),
);

/** Grouped links to the `/design-system` index and each of its pages. */
export function DesignSystemSidebar() {
  return (
    <nav aria-label="Design system">
      <NavLink to={designSystemRoot} end className={linkStyles}>
        Overview
      </NavLink>
      {designSystemGroups.map((group) => {
        const labelId = `design-system-group-${group.title.toLowerCase()}`;
        return (
          <div key={group.title}>
            <p id={labelId} className={groupLabel}>
              {group.title}
            </p>
            <ul aria-labelledby={labelId} className={list}>
              {group.pages.map((page) => (
                <li key={page.slug}>
                  <NavLink
                    to={designSystemPagePath(page.slug)}
                    end
                    className={linkStyles}
                  >
                    {page.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
