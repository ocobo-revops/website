import { Logocobo } from '~/components/ui/Logocobo';

import { ShowcaseSection } from './showcase-section';

export function LogoSection() {
  return (
    <ShowcaseSection title="Logo">
      <Logocobo width="300" />
    </ShowcaseSection>
  );
}
