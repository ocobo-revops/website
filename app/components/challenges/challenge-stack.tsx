import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { section, text } from '@ocobo/styled-system/recipes';

import { StackDiagram } from '~/components/stack/stack-diagram';
import { Container } from '~/components/ui/Container';
import { ButtonLink } from '~/components/ui/button-link';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { url } from '~/utils/url';

// After another white section, the two join: no top padding, a hairline
// above the heading instead, as in the mockup.
const joinedStyles = {
  section: css({ pt: '0' }),
  header: css({
    pt: '14',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: 'gray.light',
  }),
};

type ChallengeStackProps = {
  /** True when a white section comes just before (workstreams, partner). */
  joined: boolean;
};

/**
 * The Revenue Systems page's stack section (#238): heading, CTA to the
 * technology page, and Ocobo's stack diagram. The copy is not in the
 * challenge file: it lives in the `challenges` locale namespace.
 */
export function ChallengeStack({ joined }: ChallengeStackProps) {
  const { t } = useTranslation('challenges');
  const getLocalizedPath = useLocalizedPathname();

  return (
    <section
      className={cx(
        section({ bg: 'white' }),
        css({ overflow: 'hidden' }),
        joined ? joinedStyles.section : undefined,
      )}
    >
      <Container>
        <div
          className={cx(
            css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', lg: 'minmax(0, 1fr) auto' },
              gap: { base: '6', lg: '10' },
              alignItems: 'end',
              mb: { base: '10', lg: '14' },
            }),
            joined ? joinedStyles.header : undefined,
          )}
        >
          <div>
            <h2
              className={cx(text({ variant: 'display-lg' }), css({ mb: '4' }))}
            >
              {t('stack.title')}
            </h2>
            <p
              className={cx(
                text({ variant: 'body', color: 'muted' }),
                css({ maxW: '3xl' }),
              )}
            >
              {t('stack.intro')}
            </p>
          </div>
          <ButtonLink
            to={getLocalizedPath(url.technology)}
            variant="outline"
            className={css({ justifySelf: 'start', whiteSpace: 'nowrap' })}
          >
            {t('stack.cta')}
          </ButtonLink>
        </div>
        <StackDiagram />
      </Container>
    </section>
  );
}
