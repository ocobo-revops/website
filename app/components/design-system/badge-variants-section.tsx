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

// Literal recipe calls on purpose: Panda extracts variants from static
// values only.
export function BadgeVariantsSection() {
  return (
    <ShowcaseSection title="Badge: ai variant and xs size">
      <ul className={row}>
        <li className={badge({ variant: 'ai', size: 'xs' })}>ai xs</li>
        <li className={badge({ variant: 'ai', size: 'sm' })}>ai sm</li>
        <li className={badge({ variant: 'ai', size: 'lg' })}>ai lg</li>
      </ul>
      <ul className={row}>
        <li className={badge({ variant: 'yellow', size: 'xs' })}>yellow xs</li>
        <li className={badge({ variant: 'mint', size: 'xs' })}>mint xs</li>
        <li className={badge({ variant: 'sky', size: 'xs' })}>sky xs</li>
        <li className={badge({ variant: 'coral', size: 'xs' })}>coral xs</li>
      </ul>
      <p className={css({ color: 'gray', fontSize: 'sm', mt: '2' })}>
        The ai variant is for AI content only.
      </p>
    </ShowcaseSection>
  );
}
