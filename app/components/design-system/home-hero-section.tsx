import { css } from '@ocobo/styled-system/css';

import { HomeHero } from '~/components/home/home-hero';

import { ShowcaseSection } from './showcase-section';

const caption = css({ fontSize: 'caption', color: 'gray', mb: '6' });

export function HomeHeroSection() {
  return (
    <ShowcaseSection title="Home hero">
      <p className={caption}>
        Home page only (#240). The four teams converge on the RevOps axis, then
        growth rises above it; the flow then keeps moving along the axis, so the
        button pauses it. Under reduced motion the hero shows its final state
        and the button is hidden.
      </p>
      <HomeHero titleAs="h2" />
    </ShowcaseSection>
  );
}
