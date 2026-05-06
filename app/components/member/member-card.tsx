import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { circle } from '@ocobo/styled-system/patterns';
import { card, text } from '@ocobo/styled-system/recipes';
import { Linkedin } from 'lucide-react';

import type { Member } from '~/modules/content/members';

type MemberCardProps = {
  member: Member;
  contextLabel?: string;
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function MemberCard({ member, contextLabel }: MemberCardProps) {
  const { i18n } = useTranslation();
  const lang: 'fr' | 'en' = i18n.language.startsWith('en') ? 'en' : 'fr';
  const initials = getInitials(member.name);
  const [imgFailed, setImgFailed] = React.useState(false);

  const roleLine = contextLabel
    ? `${member.role[lang]} ${contextLabel}`
    : member.role[lang];

  return (
    <div
      className={cx(
        card({ padding: 'lg', radius: 'md', tone: 'white', border: true }),
        css({ p: { base: '8', md: '10' } }),
      )}
    >
      <div
        className={css({
          display: 'flex',
          flexDirection: { base: 'column', sm: 'row' },
          gap: '8',
          alignItems: { sm: 'flex-start' },
        })}
      >
        {/* Avatar */}
        <div
          className={cx('group', css({ position: 'relative', flexShrink: 0 }))}
        >
          <div
            aria-hidden="true"
            className={cx(
              circle({ size: '100px' }),
              text({ variant: 'display-md', color: 'dark' }),
              css({
                bg: 'gray.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                inset: 0,
              }),
            )}
          >
            {initials}
          </div>
          {!imgFailed && (
            <img
              src={member.avatar}
              alt={member.name}
              width={100}
              height={100}
              className={`${circle({ size: '100px' })} ${css({
                objectFit: 'cover',
                filter: 'grayscale(100%)',
                position: 'relative',
                zIndex: 1,
                transition: 'all 500ms',
                _groupHover: { filter: 'grayscale(0)' },
              })}`}
              onError={() => setImgFailed(true)}
            />
          )}
        </div>

        {/* Content */}
        <div className={css({ flex: 1 })}>
          <div
            className={cx(
              text({ variant: 'display-sm', color: 'dark' }),
              css({
                fontSize: { base: '2xl', md: '3xl' },
                letterSpacing: 'tight',
                lineHeight: '1.1',
              }),
            )}
          >
            {member.name}
          </div>
          <div
            className={css({
              fontSize: 'xs',
              fontWeight: 'black',
              textTransform: 'uppercase',
              letterSpacing: 'widest',
              color: 'gray.400',
              mt: '2',
            })}
          >
            {roleLine}
          </div>
          <p
            className={css({
              fontSize: 'base',
              color: 'gray.600',
              lineHeight: 'relaxed',
              mt: '4',
              maxW: 'lg',
            })}
          >
            {member.bio[lang]}
          </p>
          {member.linkedin && (
            <div className={css({ display: 'flex', gap: '3', mt: '4' })}>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} LinkedIn`}
                className={css({
                  color: 'gray.400',
                  _hover: { color: 'ocobo.dark' },
                })}
              >
                <Linkedin size={18} aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
