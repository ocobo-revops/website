import { css, cx } from '@ocobo/styled-system/css';
import { styled } from '@ocobo/styled-system/jsx';
import { button } from '@ocobo/styled-system/recipes';

import { ShowcaseSection } from './showcase-section';

const Button = styled('button', button);

const column = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
});

function ButtonVariants() {
  return (
    <>
      <li className={column}>
        <Button variant="outline">outline</Button>
        <Button variant="outline" disabled>
          disabled
        </Button>
      </li>
      <li className={column}>
        <Button variant="solid">solid</Button>
        <Button variant="solid" disabled>
          disabled
        </Button>
      </li>
    </>
  );
}

export function ButtonsSection() {
  return (
    <ShowcaseSection title="Buttons">
      <ul
        className={css({
          display: 'flex',
          gap: '4',
          p: '4',
        })}
      >
        <ButtonVariants />
      </ul>
      <ul
        className={cx(
          'dark',
          css({
            backgroundColor: 'background',
            display: 'flex',
            gap: '4',
            p: '4',
          }),
        )}
      >
        <ButtonVariants />
      </ul>
    </ShowcaseSection>
  );
}
