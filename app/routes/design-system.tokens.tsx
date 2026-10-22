import type { MetaFunction } from 'react-router';

import { BordersSection } from '~/components/design-system/borders-section';
import { GridSection } from '~/components/design-system/grid-section';
import { designSystemDescription } from '~/components/design-system/subpages';
import {
  EasingSection,
  RadiiSection,
  ShadowsSection,
} from '~/components/design-system/v2-tokens-section';
import { getMetaTags } from '~/utils/metatags';

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'design system: tokens',
    description: designSystemDescription,
    locale: 'fr',
  });
};

export default function DesignSystemTokens() {
  return (
    <>
      <RadiiSection />
      <ShadowsSection />
      <EasingSection />
      <BordersSection />
      <GridSection />
    </>
  );
}
