import { grid } from '@ocobo/styled-system/patterns';

import { Illustration } from '~/components/ui/Illustration';

import { ShowcaseSection } from './showcase-section';

export function IllustrationsSection() {
  return (
    <ShowcaseSection title="Illustrations">
      <ul className={grid({ columns: 4, alignItems: 'center' })}>
        <li>
          <Illustration name="homepage_hero" />
        </li>
        <li>
          <Illustration name="homepage_faster" />
        </li>
        <li>
          <Illustration name="homepage_remarkable" />
        </li>
        <li>
          <Illustration name="strategy_hero" />
        </li>
      </ul>
    </ShowcaseSection>
  );
}
