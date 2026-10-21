import { css, cx } from '@ocobo/styled-system/css';
import { styled } from '@ocobo/styled-system/jsx';
import { button } from '@ocobo/styled-system/recipes';

import { ShowcaseSection } from './showcase-section';

const Button = styled('button', button);

const row = css({
  display: 'flex',
  alignItems: 'center',
  gap: '4',
  p: '4',
});

const sizes = ['sm', 'md', 'lg'] as const;

function Variants() {
  return (
    <>
      <li className={row}>
        {sizes.map((size) => (
          <Button key={size} variant="secondary" size={size}>
            secondary {size}
          </Button>
        ))}
        <Button variant="secondary" disabled>
          disabled
        </Button>
      </li>
      <li className={row}>
        {sizes.map((size) => (
          <Button key={size} variant="link" size={size}>
            link {size}
          </Button>
        ))}
        <Button variant="link" disabled>
          disabled
        </Button>
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
