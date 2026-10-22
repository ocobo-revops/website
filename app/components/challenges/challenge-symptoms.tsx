import { css, cx } from '@ocobo/styled-system/css';
import { card, section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';
import { Eyebrow } from '~/components/ui/eyebrow';
import type { ChallengeSymptoms as ChallengeSymptomsData } from '~/modules/challenge-page';

type ChallengeSymptomsProps = {
  symptoms: ChallengeSymptomsData;
  eyebrow: string;
};

export function ChallengeSymptoms({
  symptoms,
  eyebrow,
}: ChallengeSymptomsProps) {
  return (
    <section className={section({ bg: 'gray' })}>
      <Container
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: '2fr 3fr' },
          gap: { base: '10', lg: '16' },
          alignItems: 'start',
        })}
      >
        <div>
          <Eyebrow className={css({ mb: '4' })}>{eyebrow}</Eyebrow>
          <h2 className={text({ variant: 'display-lg' })}>
            {symptoms.title}
            {symptoms.titleMuted ? (
              <>
                {' '}
                <span className={css({ color: 'gray' })}>
                  {symptoms.titleMuted}
                </span>
              </>
            ) : null}
          </h2>
        </div>
        <ul
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '3',
          })}
        >
          {symptoms.items.map((item, index) => (
            <li
              // Items can repeat in a draft: the position keeps keys unique.
              key={index}
              className={cx(
                card({ padding: 'sm' }),
                text({ variant: 'body' }),
                css({
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: '3.5',
                  px: '6',
                  py: '5',
                }),
              )}
            >
              <span
                aria-hidden="true"
                className={css({
                  flex: 'none',
                  w: '2.5',
                  h: '2.5',
                  mt: '2',
                  rounded: 'full',
                  bg: 'coral',
                })}
              />
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
