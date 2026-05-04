import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { circle } from '@ocobo/styled-system/patterns';

import type { Member } from '~/modules/content/members';

type HiringContactProps = {
  contact: Member;
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function HiringContact({ contact }: HiringContactProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language as 'fr' | 'en';
  const initials = getInitials(contact.name);
  const [imgFailed, setImgFailed] = React.useState(false);

  return (
    <div
      className={css({
        p: { base: '8', md: '10' },
        borderRadius: '2xl',
        bg: 'white',
        borderWidth: '1px',
        borderColor: 'gray.100',
        shadow: 'sm',
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexDirection: { base: 'column', sm: 'row' },
          gap: '8',
          alignItems: { sm: 'flex-start' },
        })}
      >
        {/* Avatar with initials fallback */}
        <div
          className={cx('group', css({ position: 'relative', flexShrink: 0 }))}
        >
          <div
            aria-hidden="true"
            className={`${circle({ size: '100px' })} ${css({
              bg: 'gray.100',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'display',
              fontWeight: 'black',
              fontSize: '2xl',
              color: 'ocobo.dark',
              position: 'absolute',
              inset: 0,
            })}`}
          >
            {initials}
          </div>
          {!imgFailed && (
            <img
              src={contact.avatar}
              alt={contact.name}
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
            className={css({
              fontFamily: 'display',
              fontWeight: 'black',
              fontSize: { base: '2xl', md: '3xl' },
              color: 'ocobo.dark',
              letterSpacing: 'tight',
              lineHeight: '1.1',
            })}
          >
            {contact.name}
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
            {contact.role[lang]} @ Ocobo
          </div>
          {contact.bio[lang] && (
            <p
              className={css({
                fontSize: 'base',
                color: 'gray.600',
                lineHeight: 'relaxed',
                mt: '4',
                maxW: 'lg',
              })}
            >
              {contact.bio[lang]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
