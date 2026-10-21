import { css } from '@ocobo/styled-system/css';
import { styled } from '@ocobo/styled-system/jsx';

import { ShowcaseSection } from './showcase-section';

const ColorBox = styled('div', {
  base: {
    display: 'inline-block',
    width: '[60px]',
    height: '[60px]',
    borderRadius: 'full',
    border: 'thin',
    borderColor: 'gray.light',
  },
});

const list = css({
  display: 'grid',
  gridTemplateColumns: '[repeat(8, 90px)]',
  alignItems: 'start',
  justifyItems: 'center',
  gap: '4',
  py: '4',
  '& li': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2',
  },
});

const colorTitle = css({
  fontSize: 'md',
  fontWeight: 'normal',
  color: 'dark',
  textAlign: 'center',
});

// Swatches stay as literal JSX: Panda only extracts static `css` values.
export function ColorsSection() {
  return (
    <ShowcaseSection title="Colors">
      <ul className={list}>
        <li>
          <ColorBox css={{ backgroundColor: 'dark' }} />
          <p className={colorTitle}>Dark</p>
        </li>
        <li>
          <ColorBox css={{ backgroundColor: 'white' }} />
          <p className={colorTitle}>White</p>
        </li>
        <li>
          <ColorBox css={{ backgroundColor: 'gray' }} />
          <p className={colorTitle}>Gray</p>
        </li>
        <li>
          <ColorBox css={{ backgroundColor: 'gray.light' }} />
          <p className={colorTitle}>Gray light</p>
        </li>
      </ul>
      <ul className={list}>
        <li>
          <ColorBox css={{ backgroundColor: 'yellow' }} />
          <p className={colorTitle}>Yellow</p>
        </li>
        <li>
          <ColorBox css={{ backgroundColor: 'mint' }} />
          <p className={colorTitle}>Mint</p>
        </li>
        <li>
          <ColorBox css={{ backgroundColor: 'sky' }} />
          <p className={colorTitle}>Sky</p>
        </li>
        <li>
          <ColorBox css={{ backgroundColor: 'coral' }} />
          <p className={colorTitle}>Coral</p>
        </li>
      </ul>
      <ul className={list}>
        <li>
          <ColorBox css={{ backgroundColor: 'yellow.light' }} />
          <p className={colorTitle}>Yellow light</p>
        </li>
        <li>
          <ColorBox css={{ backgroundColor: 'mint.light' }} />
          <p className={colorTitle}>Mint light</p>
        </li>
        <li>
          <ColorBox css={{ backgroundColor: 'sky.light' }} />
          <p className={colorTitle}>Sky light</p>
        </li>
        <li>
          <ColorBox css={{ backgroundColor: 'coral.light' }} />
          <p className={colorTitle}>Coral light</p>
        </li>
      </ul>
      <ul className={list}>
        <li>
          <ColorBox css={{ backgroundColor: 'yellow.dark' }} />
          <p className={colorTitle}>Yellow dark</p>
        </li>
        <li>
          <ColorBox css={{ backgroundColor: 'mint.dark' }} />
          <p className={colorTitle}>Mint dark</p>
        </li>
        <li>
          <ColorBox css={{ backgroundColor: 'sky.dark' }} />
          <p className={colorTitle}>Sky dark</p>
        </li>
        <li>
          <ColorBox css={{ backgroundColor: 'coral.dark' }} />
          <p className={colorTitle}>Coral dark</p>
        </li>
      </ul>
    </ShowcaseSection>
  );
}
