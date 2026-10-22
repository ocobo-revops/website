import type { MetaFunction } from 'react-router';

import { css } from '@ocobo/styled-system/css';

import { BordersSection } from '~/components/design-system/borders-section';
import { ButtonBadgeEyebrowSections } from '~/components/design-system/button-badge-eyebrow-sections';
import { ButtonsSection } from '~/components/design-system/buttons-section';
import { CardRecipeSection } from '~/components/design-system/card-recipe-section';
import { ColorsSection } from '~/components/design-system/colors-section';
import { FlipCardSection } from '~/components/design-system/flip-card-section';
import { FormSection } from '~/components/design-system/form-section';
import { GridSection } from '~/components/design-system/grid-section';
import { IconsSection } from '~/components/design-system/icons-section';
import { IllustrationsSection } from '~/components/design-system/illustrations-section';
import { LogoSection } from '~/components/design-system/logo-section';
import { MetaPillSection } from '~/components/design-system/meta-pill-section';
import { MotionSection } from '~/components/design-system/motion-section';
import { NavbarFooterSection } from '~/components/design-system/navbar-footer-section';
import { PersonCardSection } from '~/components/design-system/person-card-section';
import { TooltipSection } from '~/components/design-system/tooltip-section';
import { TypographySection } from '~/components/design-system/typography-section';
import { V2TokensSection } from '~/components/design-system/v2-tokens-section';
import { Container } from '~/components/ui/Container';
import { getMetaTags } from '~/utils/metatags';

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'design system',
    description:
      "ensemble de composants réutilisables, guidés par des principes de design, qui peuvent être assemblés pour construire n'importe quel nombre d'applications.",
    locale: 'fr',
  });
};

// Each showcase section lives in its own module under
// `app/components/design-system/`. Add a section by creating a module there
// and placing it in the list below.
export default function Index() {
  return (
    <Container>
      <header
        className={css({
          marginBottom: '8',
        })}
      >
        <h1 className={css({ textStyle: 'heading1' })}>Design System</h1>
      </header>
      <V2TokensSection />
      <LogoSection />
      <TypographySection />
      <ColorsSection />
      <ButtonsSection />
      <ButtonBadgeEyebrowSections />
      <NavbarFooterSection />
      <BordersSection />
      <FormSection />
      <MetaPillSection />
      <IconsSection />
      <IllustrationsSection />
      <CardRecipeSection />
      <FlipCardSection />
      <PersonCardSection />
      <GridSection />
      <TooltipSection />
      <MotionSection />
    </Container>
  );
}
