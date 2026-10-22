import { Link } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { grid } from '@ocobo/styled-system/patterns';
import { card, text } from '@ocobo/styled-system/recipes';

import {
  designSystemGroups,
  designSystemPagePath,
} from '~/components/design-system/subpages';

const groupTitle = cx(
  text({ variant: 'label' }),
  css({ color: 'gray', mb: '4' }),
);
const cardStyles = cx(
  card(),
  css({
    position: 'relative',
    h: 'full',
    transition: 'shadow',
    _hover: { shadow: 'hover' },
  }),
);
const titleStyles = cx(text({ variant: 'display-md-bold' }), css({ mb: '2' }));
// The heading link stretches over the whole card, so the card is clickable
// while the link name stays the page title. The focus outline is drawn on the
// stretched area, so it frames the card without relying on `:has()`.
const stretchedLink = css({
  _after: {
    content: '""',
    position: 'absolute',
    inset: '0',
    rounded: '2xl',
  },
  _focusVisible: {
    outline: 'none',
    _after: {
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: 'foreground',
      outlineOffset: '0.5',
    },
  },
});

export default function DesignSystemIndex() {
  return (
    <div
      className={css({ display: 'flex', flexDirection: 'column', gap: '12' })}
    >
      {designSystemGroups.map((group) => (
        <section key={group.title}>
          <h2 className={groupTitle}>{group.title}</h2>
          <ul
            className={grid({
              columns: { base: 1, md: 2, xl: 3 },
              gap: '6',
            })}
          >
            {group.pages.map((page) => (
              <li key={page.slug} className={cardStyles}>
                <h3 className={titleStyles}>
                  <Link
                    to={designSystemPagePath(page.slug)}
                    className={stretchedLink}
                  >
                    {page.title}
                  </Link>
                </h3>
                <p className={text({ variant: 'body' })}>{page.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
