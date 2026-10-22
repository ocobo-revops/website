import { Link } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { grid } from '@ocobo/styled-system/patterns';
import { card, text } from '@ocobo/styled-system/recipes';

import { designSystemSubpages } from '~/components/design-system/subpages';

// The heading link stretches over the whole card, so the card is clickable
// while the link name stays the subpage title.
const cardStyles = cx(
  card(),
  css({
    position: 'relative',
    h: 'full',
    transition: 'shadow',
    _hover: { shadow: 'hover' },
    '&:has(a:focus-visible)': {
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: 'foreground',
      outlineOffset: '0.5',
    },
  }),
);
const titleStyles = cx(text({ variant: 'display-md-bold' }), css({ mb: '2' }));
const stretchedLink = css({
  _focusVisible: { outline: 'none' },
  _after: { content: '""', position: 'absolute', inset: '0' },
});

export default function DesignSystemIndex() {
  return (
    <ul className={grid({ columns: { base: 1, md: 3 }, gap: '6' })}>
      {designSystemSubpages.map(({ to, title, description }) => (
        <li key={to} className={cardStyles}>
          <h2 className={titleStyles}>
            <Link to={to} className={stretchedLink}>
              {title}
            </Link>
          </h2>
          <p className={text({ variant: 'body' })}>{description}</p>
        </li>
      ))}
    </ul>
  );
}
