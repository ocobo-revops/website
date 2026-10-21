import { css } from '@ocobo/styled-system/css';

import { Eyebrow } from '~/components/ui/eyebrow';

import { ShowcaseSection } from './showcase-section';

const colors = ['yellow', 'sky', 'mint', 'coral'] as const;

export function EyebrowSection() {
  return (
    <ShowcaseSection title="Eyebrow">
      <ul
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '4',
        })}
      >
        <li>
          <Eyebrow>Without dot</Eyebrow>
        </li>
        {colors.map((color) => (
          <li key={color}>
            <Eyebrow dotColor={color}>With {color} dot</Eyebrow>
          </li>
        ))}
      </ul>
    </ShowcaseSection>
  );
}
