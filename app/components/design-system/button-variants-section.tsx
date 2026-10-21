import { css, cx } from '@ocobo/styled-system/css';
import { button } from '@ocobo/styled-system/recipes';

import { ShowcaseSection } from './showcase-section';

const row = css({
  display: 'flex',
  alignItems: 'center',
  gap: '4',
  p: '4',
});

// Literal recipe calls on purpose: Panda extracts variants from static values
// only, and does not follow `styled('button', button)` props.
function Variants() {
  return (
    <>
      <li className={row}>
        <button
          type="button"
          className={button({ variant: 'secondary', size: 'sm' })}
        >
          secondary sm
        </button>
        <button
          type="button"
          className={button({ variant: 'secondary', size: 'md' })}
        >
          secondary md
        </button>
        <button
          type="button"
          className={button({ variant: 'secondary', size: 'lg' })}
        >
          secondary lg
        </button>
        <button
          type="button"
          className={button({ variant: 'secondary' })}
          disabled
        >
          disabled
        </button>
      </li>
      <li className={row}>
        <button
          type="button"
          className={button({ variant: 'link', size: 'sm' })}
        >
          link sm
        </button>
        <button
          type="button"
          className={button({ variant: 'link', size: 'md' })}
        >
          link md
        </button>
        <button
          type="button"
          className={button({ variant: 'link', size: 'lg' })}
        >
          link lg
        </button>
        <button type="button" className={button({ variant: 'link' })} disabled>
          disabled
        </button>
      </li>
    </>
  );
}

export function ButtonVariantsSection() {
  return (
    <ShowcaseSection title="Button: secondary and link">
      <ul>
        <Variants />
      </ul>
      <ul
        className={cx(
          'dark',
          css({ backgroundColor: 'background', color: 'foreground' }),
        )}
      >
        <Variants />
      </ul>
    </ShowcaseSection>
  );
}
