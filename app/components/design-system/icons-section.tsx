import { Check, ChevronRight, Menu, X } from 'lucide-react';

import { css } from '@ocobo/styled-system/css';
import { hstack } from '@ocobo/styled-system/patterns';

import { ShowcaseSection } from './showcase-section';

const iconSize = css({ h: '6', w: '6' });

export function IconsSection() {
  return (
    <ShowcaseSection title="Icons">
      <ul className={hstack()}>
        <li>
          <Menu className={iconSize} />
        </li>
        <li>
          <X className={iconSize} />
        </li>
        <li>
          <ChevronRight className={iconSize} />
        </li>
        <li className={css({ color: 'mint' })}>
          <Check className={iconSize} />
        </li>
        <li className={css({ color: 'coral' })}>
          <X className={iconSize} />
        </li>
      </ul>
    </ShowcaseSection>
  );
}
