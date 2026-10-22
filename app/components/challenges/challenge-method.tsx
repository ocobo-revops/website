import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { card, section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';
import { OptimizedImage } from '~/components/ui/optimized-image';
import type { ChallengeMethod as ChallengeMethodData } from '~/modules/challenge-page';
import type { ChallengeKey } from '~/modules/challenge-schema';
import type { Tool } from '~/modules/content/tools';

// The mockup numbers the steps in the brand colours, and Revenue AI in its
// gradient (display size, so gradient text is allowed by ADR 0002). Static
// literals: Panda only ships the classes it can read (CLAUDE.md).
const stepNumberStyles = [
  css({ color: 'yellow' }),
  css({ color: 'mint' }),
  css({ color: 'sky' }),
];
const aiStepNumber = css({ textGradient: 'ai-text' });

type ChallengeMethodProps = {
  method: ChallengeMethodData;
  challenge: ChallengeKey;
  /** The method tools resolved from their Tool files, in file order. */
  tools: Tool[];
};

export function ChallengeMethod({
  method,
  challenge,
  tools,
}: ChallengeMethodProps) {
  const { t } = useTranslation('challenges');
  const hasToolbox = tools.length > 0 || method.note !== null;
  // Same three steps on every page, so the locale holds their titles.
  const stepTitles = [t('method.step1'), t('method.step2'), t('method.step3')];

  return (
    <section className={section({ bg: 'gray' })}>
      <Container>
        <div
          className={css({
            maxW: '2xl',
            mx: 'auto',
            mb: { base: '12', md: '16' },
            textAlign: 'center',
          })}
        >
          <h2 className={cx(text({ variant: 'display-lg' }), css({ mb: '4' }))}>
            {method.title ?? t('method.title')}
          </h2>
          {method.subtitle ? (
            <p className={text({ variant: 'body', color: 'muted' })}>
              {method.subtitle}
            </p>
          ) : null}
        </div>
        <ol
          // `list-style: none` drops list semantics in Safari.
          role="list"
          className={cx(
            css({
              display: 'grid',
              gridTemplateColumns: {
                base: '1fr',
                md: 'repeat(3, minmax(0, 1fr))',
              },
              gap: '10',
            }),
            hasToolbox ? css({ mb: { base: '12', md: '16' } }) : null,
          )}
        >
          {method.steps.map((step, index) => (
            <li
              key={stepTitles[index]}
              className={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '3.5',
              })}
            >
              <span
                aria-hidden="true"
                className={cx(
                  text({ variant: 'display-lg' }),
                  challenge === 'ai' ? aiStepNumber : stepNumberStyles[index],
                )}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className={text({ variant: 'display-md-bold' })}>
                {step.title ?? stepTitles[index]}
              </h3>
              {step.text ? (
                <p className={text({ variant: 'body', color: 'muted' })}>
                  {step.text}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
        {hasToolbox ? (
          <div
            className={cx(
              card({ padding: 'lg' }),
              css({ display: 'flex', flexDirection: 'column', gap: '7' }),
            )}
          >
            {tools.length > 0 ? (
              <>
                <p className={text({ variant: 'label', color: 'muted' })}>
                  {t('method.tools')}
                </p>
                <ul
                  role="list"
                  className={css({
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    columnGap: '12',
                    rowGap: '8',
                  })}
                >
                  {tools.map((tool) => (
                    <li key={tool.slug}>
                      {tool.iconUrl ? (
                        <OptimizedImage
                          src={tool.iconUrl}
                          alt={tool.name}
                          className={css({ h: '8', w: 'auto' })}
                        />
                      ) : (
                        <span
                          className={cx(
                            text({ variant: 'display-md-bold' }),
                            css({ color: 'gray' }),
                          )}
                        >
                          {tool.name}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {method.note ? (
              <p className={text({ variant: 'body', color: 'muted' })}>
                {method.note}
              </p>
            ) : null}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
