import { NavLink, useLocation } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import { sectionId } from './showcase-section';
import {
  designSystemGroups,
  designSystemPagePath,
  designSystemRoot,
  findDesignSystemPage,
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

const focusRing = css({
  _focusVisible: {
    outlineWidth: '2px',
    outlineStyle: 'solid',
    outlineColor: 'foreground',
    outlineOffset: '0.5',
  },
});

// `NavLink` sets `aria-current="page"` on the current page. The weight, and
// the left bar from `lg`, mark it apart from hover beyond colour alone.
const linkStyles = cx(
  text({ variant: 'small' }),
  focusRing,
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
  }),
);

// The section links of the current page sit under its link. Above the
// content on small screens they would only push the page down, so they show
// from `lg`.
const sectionList = css({
  display: { base: 'none', lg: 'flex' },
  flexDirection: 'column',
  gap: '0.5',
  mt: '1',
  mb: '2',
  ml: '3',
  pl: '3',
  borderLeft: 'thin',
  borderColor: 'line',
});
const sectionLinkStyles = cx(
  text({ variant: 'small' }),
  focusRing,
  css({
    display: 'block',
    py: '1',
    color: 'gray',
    transition: 'colors',
    _hover: { color: 'foreground' },
  }),
);

type SectionLinksProps = {
  sections: readonly string[];
};

/**
 * Plain anchor links to the current page's section headings. They are
 * rendered on the server and work before hydration.
 */
function SectionLinks({ sections }: SectionLinksProps) {
  return (
    <ul aria-label="On this page" className={sectionList}>
      {sections.map((title) => (
        <li key={title}>
          <a href={`#${sectionId(title)}`} className={sectionLinkStyles}>
            {title}
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * Grouped links to the `/design-system` index and each of its pages. The
 * current page lists its sections under its link when it has more than one.
 */
export function DesignSystemSidebar() {
  const { pathname } = useLocation();
  const current = findDesignSystemPage(pathname);

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
                  {current?.page.slug === page.slug &&
                  page.sections.length > 1 ? (
                    <SectionLinks sections={page.sections} />
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
