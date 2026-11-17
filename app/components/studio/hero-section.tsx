import { ArrowRight } from 'lucide-react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { badge, button, text } from '@ocobo/styled-system/recipes';

import { MemberAvatar } from '~/components/member/member-avatar';
import { Container } from '~/components/ui/Container';
import { headlineAccent } from '~/components/ui/headline-accent';
import type { StudioMemberCard } from '~/modules/studio-team';
import { getFirstName } from '~/utils/first-name';

import {
  MarqueePauseButton,
  MarqueeTrack,
  marqueeEdgeFade,
  marqueeHoverPause,
  marqueeWrapWhenStill,
} from './studio-marquee';

/**
 * Below this many members, a row of 208px cards leaves a gap on a wide
 * screen before its loop restarts: the cards then sit in a static grid.
 */
const MARQUEE_MIN_MEMBERS = 12;

/** Photos loaded eagerly per row: the ones in view below the CTA. */
const EAGER_PHOTOS = 4;

// Two rows, tilted, a little wider than the screen (mockup `equipe`).
const tiltedRows = css({
  display: 'flex',
  flexDirection: 'column',
  w: '[108%]',
  ml: '[-4%]',
  // With the row padding, 24px around and between the rows.
  py: '3',
  transform: 'rotate(-3deg)',
  // Still rows sit flat and inside the screen.
  _motionReduce: { w: 'full', ml: '0', transform: 'none' },
});
// The rows stop at the content width and fade out on both sides (mockup
// `equipe`). Still rows need no fade.
const rowsFrame = css({
  mt: '10',
  py: '7',
  overflow: 'hidden',
  maskImage:
    '[linear-gradient(90deg, transparent 0, black 12%, black 88%, transparent 100%)]',
  _motionReduce: { maskImage: '[none]' },
});
// The row clips its overflow: the padding leaves room for a lifted card.
const rowList = css({ display: 'flex', gap: '5', pr: '5', py: '3' });
const staticList = css({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '5',
});
const memberCard = css({
  flex: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4',
  w: '52',
  px: '4',
  pt: '7',
  pb: '5',
  bg: 'gray.100',
  borderRadius: '2xl',
  textAlign: 'center',
  // The card lifts and tilts a little more on hover (mockup `equipe`).
  transitionProperty: 'common',
  transitionDuration: 'slow',
  // Without motion, the card only takes the shadow.
  _hover: { boxShadow: 'hover' },
  _motionSafe: { _hover: { transform: 'translateY(-6px) rotate(-1deg)' } },
});
const cardName = text({ variant: 'display-md-black' });
const cardRole = text({ variant: 'small', color: 'muted' });

type MemberCardsProps = {
  members: StudioMemberCard[];
  /** A marquee copy: hidden from assistive tech, photos load lazily. */
  hidden?: boolean;
  label?: string;
  className: string;
};

function MemberCards({ members, hidden, label, className }: MemberCardsProps) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      aria-label={label}
      className={className}
    >
      {members.map((member, index) => (
        <li key={member.slug} className={memberCard}>
          <MemberAvatar
            name={member.name}
            photo={member.photo}
            challenge={member.challenge}
            // The first cards sit just below the CTA, above the fold.
            loading={!hidden && index < EAGER_PHOTOS ? 'eager' : 'lazy'}
          />
          <span className={css({ display: 'flex', flexDirection: 'column' })}>
            <span className={cardName}>{getFirstName(member.name)}</span>
            <span className={cardRole}>{member.role}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

type HeroSectionProps = {
  members: StudioMemberCard[];
};

/**
 * The promise and a link to the team, then two tilted rows of member cards that scroll in opposite
 * directions. A visible button pauses them (WCAG 2.2.2). Reduced motion
 * stops them, and a small team shows as a static grid.
 */
export function HeroSection({ members }: HeroSectionProps) {
  const { t } = useTranslation('studio');
  const [paused, setPaused] = React.useState(false);
  const half = Math.ceil(members.length / 2);
  const rows = [
    { key: 'first', direction: 'left', members: members.slice(0, half) },
    { key: 'second', direction: 'right', members: members.slice(half) },
  ] as const;

  return (
    <section
      className={css({
        pt: '40',
        pb: { base: '16', md: '20', lg: '28' },
        textAlign: 'center',
        overflow: 'hidden',
      })}
    >
      <Container>
        <div className={css({ maxW: '4xl', mx: 'auto' })}>
          <span className={cx(badge({ variant: 'mint' }), css({ mb: '10' }))}>
            {t('hero.badge')}
          </span>
          <h1 className={cx(text({ variant: 'display-xl' }), css({ mb: '8' }))}>
            {t('hero.title.line1')}
            <br />
            {t('hero.title.line2')}
            <br />
            <span className={headlineAccent.mint}>
              {t('hero.title.highlight')}
            </span>
          </h1>
          <p
            className={cx(
              text({ variant: 'body', color: 'muted' }),
              css({ maxW: '2xl', mx: 'auto', mb: '10' }),
            )}
          >
            {t('hero.subtitle')}
          </p>
          <a href="#equipe" className={button({ variant: 'cta', size: 'lg' })}>
            {t('hero.cta')}
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </Container>

      {members.length > 0 && members.length < MARQUEE_MIN_MEMBERS && (
        <Container className={css({ mt: '16' })}>
          <MemberCards
            members={members}
            label={t('hero.members')}
            className={staticList}
          />
        </Container>
      )}

      {members.length >= MARQUEE_MIN_MEMBERS && (
        <>
          <Container>
            <div
              role="group"
              aria-label={t('hero.members')}
              className={cx(rowsFrame, marqueeHoverPause)}
            >
              <div className={tiltedRows}>
                {rows.map((row) => (
                  <div key={row.key} className={marqueeEdgeFade}>
                    <MarqueeTrack
                      direction={row.direction}
                      paused={paused}
                      // The rows are tilted: a GPU layer would blur them.
                      painted
                      renderCopy={({ hidden, className }) => (
                        <MemberCards
                          members={row.members}
                          hidden={hidden}
                          className={cx(
                            rowList,
                            marqueeWrapWhenStill,
                            className,
                          )}
                        />
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Container>
          <Container
            className={css({ display: 'flex', justifyContent: 'flex-end' })}
          >
            <MarqueePauseButton
              paused={paused}
              onToggle={() => setPaused((value) => !value)}
            />
          </Container>
        </>
      )}
    </section>
  );
}
