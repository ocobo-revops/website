import { css, cx } from '@ocobo/styled-system/css';
import { section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';
import { ButtonLink } from '~/components/ui/button-link';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import type { ChallengeDiagnostic as ChallengeDiagnosticData } from '~/modules/challenge-page';
import { url } from '~/utils/url';

/** Anchor of the block, the target of the hero CTA. */
export const DIAGNOSTIC_ID = 'diagnostic';

type ChallengeDiagnosticProps = {
  diagnostic: ChallengeDiagnosticData;
  /** Button label when the challenge has no CTA of its own. */
  fallbackCta: string;
};

export function ChallengeDiagnostic({
  diagnostic,
  fallbackCta,
}: ChallengeDiagnosticProps) {
  const getLocalizedPath = useLocalizedPathname();

  return (
    <section
      id={DIAGNOSTIC_ID}
      className={cx(
        section({ bg: 'yellow' }),
        css({ textAlign: 'center', scrollMarginTop: '20' }),
      )}
    >
      <Container narrow>
        <h2 className={cx(text({ variant: 'display-lg' }), css({ mb: '8' }))}>
          {diagnostic.question}
        </h2>
        {diagnostic.subtitle ? (
          <p
            className={cx(
              text({ variant: 'display-md-bold' }),
              css({ mb: '12' }),
            )}
          >
            {diagnostic.subtitle}
          </p>
        ) : null}
        <ButtonLink
          to={getLocalizedPath(url.contact)}
          variant="primary"
          size="lg"
        >
          {diagnostic.cta ?? fallbackCta}
        </ButtonLink>
      </Container>
    </section>
  );
}
