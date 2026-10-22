import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import { sectionId } from './showcase-section';

const label = cx(text({ variant: 'label' }), css({ color: 'gray', mb: '3' }));
const list = css({ display: 'flex', flexDirection: 'column', gap: '2' });
const linkStyles = cx(
  text({ variant: 'small' }),
  css({
    display: 'block',
    color: 'gray',
    transition: 'colors',
    _hover: { color: 'foreground' },
    _focusVisible: {
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: 'foreground',
      outlineOffset: '0.5',
    },
  }),
);

type OnThisPageProps = {
  sections: readonly string[];
};

/**
 * Plain anchor links to the page's section headings. They are rendered on the
 * server and work before hydration.
 */
export function OnThisPage({ sections }: OnThisPageProps) {
  return (
    <nav aria-label="On this page">
      <p className={label}>On this page</p>
      <ul className={list}>
        {sections.map((title) => (
          <li key={title}>
            <a href={`#${sectionId(title)}`} className={linkStyles}>
              {title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
