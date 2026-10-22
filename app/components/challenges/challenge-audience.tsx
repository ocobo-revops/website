import { UserRound } from 'lucide-react';

import { css, cx } from '@ocobo/styled-system/css';
import { card, section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';
import type { ChallengeAudienceItem } from '~/modules/challenge-page';

type ChallengeAudienceProps = {
  audience: ChallengeAudienceItem[];
  title: string;
  intro: string;
};

export function ChallengeAudience({
  audience,
  title,
  intro,
}: ChallengeAudienceProps) {
  return (
    // The page root sets `colorPalette` to the challenge colour (route file).
    <section
      id="pour-qui"
      className={cx(section(), css({ bg: 'colorPalette.light' }))}
    >
      <Container>
        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', md: '2fr 3fr' },
            gap: { base: '6', md: '16' },
            alignItems: 'end',
            mb: '12',
          })}
        >
          <h2 className={text({ variant: 'display-lg' })}>{title}</h2>
          <p className={text({ variant: 'body', color: 'muted' })}>{intro}</p>
        </div>
        <ul
          className={css({
            display: 'grid',
            gridTemplateColumns: {
              base: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(4, minmax(0, 1fr))',
            },
            gap: '5',
          })}
        >
          {audience.map((item, index) => (
            <li
              // Entries can repeat in a draft: the position keeps keys unique.
              key={index}
              className={cx(
                card({ border: false, shadow: 'elevated' }),
                css({ gap: '3.5' }),
              )}
            >
              <span
                aria-hidden="true"
                className={css({
                  alignSelf: 'flex-start',
                  display: 'flex',
                  p: '3',
                  rounded: 'full',
                  bg: 'colorPalette',
                  color: 'dark',
                })}
              >
                <UserRound size={22} />
              </span>
              {item.team ? (
                <span className={text({ variant: 'label', color: 'muted' })}>
                  {item.team}
                </span>
              ) : null}
              <span className={text({ variant: 'display-md-bold' })}>
                {item.roles}
              </span>
              {item.benefit ? (
                <span className={text({ variant: 'small', color: 'muted' })}>
                  {item.benefit}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
