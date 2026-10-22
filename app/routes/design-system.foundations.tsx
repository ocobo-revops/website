import type { MetaFunction } from 'react-router';

import { BordersSection } from '~/components/design-system/borders-section';
import { ColorsSection } from '~/components/design-system/colors-section';
import { GridSection } from '~/components/design-system/grid-section';
import { IconsSection } from '~/components/design-system/icons-section';
import { IllustrationsSection } from '~/components/design-system/illustrations-section';
import { LogoSection } from '~/components/design-system/logo-section';
import { designSystemDescription } from '~/components/design-system/subpages';
import { TypographySection } from '~/components/design-system/typography-section';
import { V2TokensSection } from '~/components/design-system/v2-tokens-section';
import { getMetaTags } from '~/utils/metatags';

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'design system: foundations',
    description: designSystemDescription,
    locale: 'fr',
  });
};

// Tokens and visual basics. Add a section by creating a module under
// `app/components/design-system/` and placing it in the list below.
export default function DesignSystemFoundations() {
  return (
    <>
      <V2TokensSection />
      <TypographySection />
      <ColorsSection />
      <BordersSection />
      <IconsSection />
      <LogoSection />
      <IllustrationsSection />
      <GridSection />
    </>
  );
}
