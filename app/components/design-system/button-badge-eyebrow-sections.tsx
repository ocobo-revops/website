import { BadgeVariantsSection } from './badge-variants-section';
import { ButtonVariantsSection } from './button-variants-section';
import { EyebrowSection } from './eyebrow-section';

/** The v2 button, badge and eyebrow additions (#221), one section each. */
export function ButtonBadgeEyebrowSections() {
  return (
    <>
      <ButtonVariantsSection />
      <BadgeVariantsSection />
      <EyebrowSection />
    </>
  );
}
