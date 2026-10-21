import { css } from '@ocobo/styled-system/css';
import { grid } from '@ocobo/styled-system/patterns';

import { ShowcaseSection } from './showcase-section';

export function BordersSection() {
  return (
    <ShowcaseSection title="Borders">
      <ul className={grid({ columns: 4, gap: '6' })}>
        <li className={css({ bleft: 'yellow' })}>
          Gagnez en performance avec des stratégies et des process de pointe
        </li>
        <li className={css({ bleft: 'sky' })}>
          Gagnez en performance avec des stratégies et des process de pointe
        </li>
        <li className={css({ bleft: 'mint' })}>
          Gagnez en performance avec des stratégies et des process de pointe
        </li>
        <li className={css({ bleft: 'coral' })}>
          Gagnez en performance avec des stratégies et des process de pointe
        </li>
      </ul>
    </ShowcaseSection>
  );
}
