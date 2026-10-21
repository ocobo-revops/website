import { grid } from '@ocobo/styled-system/patterns';

import { ShowcaseSection } from './showcase-section';

export function GridSection() {
  return (
    <ShowcaseSection title="Grid">
      <ul
        className={grid({
          columns: 12,
          '& > li': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'gray.light',
            minHeight: '[200px]',
          },
        })}
      >
        <li>col 1</li>
        <li>col 2</li>
        <li>col 3</li>
        <li>col 4</li>
        <li>col 5</li>
        <li>col 6</li>
        <li>col 7</li>
        <li>col 8</li>
        <li>col 9</li>
        <li>col 10</li>
        <li>col 11</li>
        <li>col 12</li>
      </ul>
    </ShowcaseSection>
  );
}
