import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { badge, section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';
import { ButtonLink } from '~/components/ui/button-link';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import type { ChallengeAiBridge as ChallengeAiBridgeData } from '~/modules/challenge-page';
import type { ChallengeKey } from '~/modules/challenge-schema';

import { AgentWindow } from './agent-window';

// AI content: the gradient fills the pill and the button, never the text.
const aiButton = css({ bgGradient: 'ai', borderColor: 'transparent' });

const layouts = {
  withDemo: css({
    display: 'grid',
    gridTemplateColumns: { base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
    gap: { base: '10', lg: '16' },
    alignItems: 'center',
  }),
  solo: css({ maxW: '3xl' }),
};

type ChallengeAiBridgeProps = {
  aiBridge: ChallengeAiBridgeData;
  challenge: ChallengeKey;
  /** Slug of the Revenue AI page, the target of the CTA; `null` hides it. */
  aiChallengeSlug: string | null;
};

export function ChallengeAiBridge({
  aiBridge,
  challenge,
  aiChallengeSlug,
}: ChallengeAiBridgeProps) {
  const { t } = useTranslation('challenges');
  const getLocalizedPath = useLocalizedPathname();
  const { title, bullets, demo } = aiBridge;
  // The Revenue AI page states its own view and links nowhere else.
  const isAiPage = challenge === 'ai';
  const ctaSlug = isAiPage ? null : aiChallengeSlug;

  return (
    <section
      className={cx(
        section({ bg: 'dark' }),
        css({ position: 'relative', overflow: 'hidden' }),
      )}
    >
      <div
        aria-hidden="true"
        className={css({
          position: 'absolute',
          inset: '0',
          backgroundImage:
            '[radial-gradient(rgba(255,255,255,0.11) 1px, transparent 1.2px)]',
          backgroundSize: '[22px 22px]',
          maskImage:
            '[radial-gradient(ellipse at center, black, transparent 75%)]',
        })}
      />
      <Container className={css({ position: 'relative' })}>
        <div className={demo ? layouts.withDemo : layouts.solo}>
          <div>
            <span
              className={cx(
                badge({ variant: 'ai', size: 'sm' }),
                css({ mb: '6' }),
              )}
            >
              {isAiPage ? t('aiBridge.eyebrowAi') : t('aiBridge.eyebrow')}
            </span>
            <h2
              className={cx(
                text({ variant: 'display-lg', color: 'white' }),
                css({ mb: '8' }),
              )}
            >
              {title}
            </h2>
            <ul
              // `list-style: none` drops list semantics in Safari.
              role="list"
              className={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '3.5',
              })}
            >
              {bullets.map((bullet, index) => (
                <li
                  key={`${index}-${bullet}`}
                  className={cx(
                    text({ variant: 'body' }),
                    css({ color: 'white/80' }),
                  )}
                >
                  {bullet}
                </li>
              ))}
            </ul>
            {ctaSlug ? (
              <ButtonLink
                to={getLocalizedPath(`/challenges/${ctaSlug}`)}
                variant="white"
                className={cx(aiButton, css({ mt: '10' }))}
              >
                {t('aiBridge.cta')}
              </ButtonLink>
            ) : null}
          </div>
          {demo ? (
            <figure
              aria-label={t('aiBridge.windowLabel', {
                agent: demo.agent,
                interpolation: { escapeValue: false },
              })}
            >
              <AgentWindow demo={demo} />
              {demo.note ? (
                <figcaption
                  className={css({
                    mt: '4',
                    fontSize: 'caption',
                    color: 'white/60',
                    textAlign: 'center',
                  })}
                >
                  {demo.note}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
