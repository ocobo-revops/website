import { css } from '@ocobo/styled-system/css';
import { badge } from '@ocobo/styled-system/recipes';

import { ShowcaseSection } from './showcase-section';

const row = css({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '4',
  py: '2',
});

const variants = ['yellow', 'mint', 'sky', 'coral', 'ai'] as const;
const sizes = ['xs', 'sm', 'lg'] as const;

export function BadgeVariantsSection() {
  return (
    <ShowcaseSection title="Badge: ai variant and xs size">
      {sizes.map((size) => (
        <ul key={size} className={row}>
          {variants.map((variant) => (
            <li key={variant}>
              <span className={badge({ variant, size })}>
                {variant} {size}
              </span>
            </li>
          ))}
        </ul>
      ))}
      <p className={css({ color: 'gray', fontSize: 'sm', mt: '2' })}>
        The ai variant is for AI content only.
      </p>
    </ShowcaseSection>
  );
}
