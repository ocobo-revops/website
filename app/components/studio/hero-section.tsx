import { Trans, useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { badge, text } from '@ocobo/styled-system/recipes';

import { MemberAvatar } from '~/components/member/member-avatar';
import { Container } from '~/components/ui/Container';
import { ContactCta } from '~/components/ui/contact-cta';
import { headlineAccent } from '~/components/ui/headline-accent';
import type { StudioMemberCard } from '~/modules/studio-team';
import { getFirstName } from '~/utils/first-name';

/** Copies of the member list in the marquee: its keyframes move by a third. */
const COPIES = [0, 1, 2] as const;
/**
 * Below this many members, one copy of 160px tiles leaves a gap on a wide
 * screen before the loop restarts: the faces then sit in a static row.
 */
const MARQUEE_MIN_MEMBERS = 12;

const marqueeTrack = css({
  display: 'flex',
  w: 'max',
  animation: 'marquee-ultra-slow',
  _motionReduce: {
    animation: '[none]',
    w: 'full',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
const marqueeList = css({
  display: 'flex',
  _motionReduce: { flexWrap: 'wrap', justifyContent: 'center' },
});
// Without motion, one copy of the list is enough.
const extraCopy = css({ _motionReduce: { display: 'none' } });
const staticList = css({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
});
const tile = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2',
  w: '40',
  px: '3',
  textAlign: 'center',
});
const tileName = cx(text({ variant: 'small' }), css({ fontWeight: 'bold' }));
const tileRole = text({ variant: 'small', color: 'muted' });

type MemberTilesProps = {
  members: StudioMemberCard[];
  /** Names the list. The copies of the marquee have none. */
  label?: string;
  /** A marquee copy: hidden from assistive tech, photos load lazily. */
  hidden?: boolean;
  className: string;
};

function MemberTiles({ members, label, hidden, className }: MemberTilesProps) {
  return (
    <ul
      aria-label={label}
      aria-hidden={hidden || undefined}
      className={className}
    >
      {members.map((member) => (
        <li key={member.slug} className={tile}>
          <MemberAvatar
            name={member.name}
            photo={member.photo}
            challenge={member.challenge}
            // The first copy sits just below the CTA, above the fold.
            loading={hidden ? 'lazy' : 'eager'}
          />
          <span className={tileName}>{getFirstName(member.name)}</span>
          <span className={tileRole}>{member.role}</span>
        </li>
      ))}
    </ul>
  );
}

type HeroSectionProps = {
  members: StudioMemberCard[];
};

export function HeroSection({ members }: HeroSectionProps) {
  const { t } = useTranslation('studio');

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
            <Trans
              i18nKey="hero.subtitle"
              ns="studio"
              components={{ bold: <strong /> }}
            />
          </p>
          <ContactCta variant="cta" size="lg">
            {t('hero.cta')}
          </ContactCta>
        </div>
      </Container>

      {members.length > 0 && (
        <div className={css({ mt: '16', overflow: 'hidden' })}>
          {members.length < MARQUEE_MIN_MEMBERS ? (
            <MemberTiles
              members={members}
              label={t('hero.members')}
              className={staticList}
            />
          ) : (
            <div className={marqueeTrack}>
              {COPIES.map((copy) =>
                copy === 0 ? (
                  <MemberTiles
                    key={copy}
                    members={members}
                    label={t('hero.members')}
                    className={marqueeList}
                  />
                ) : (
                  <MemberTiles
                    key={copy}
                    members={members}
                    className={cx(marqueeList, extraCopy)}
                    hidden
                  />
                ),
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
