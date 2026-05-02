import { css } from '@ocobo/styled-system/css';

import { ASSETS_BASE_URL } from '~/config/assets';
import type { HiringContact as HiringContactData } from '~/modules/schemas';

type HiringContactProps = {
  contact: HiringContactData;
};

export function HiringContact({ contact }: HiringContactProps) {
  const photoUrl = `${ASSETS_BASE_URL}/team/${contact.photo}`;

  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: { base: 'column', md: 'row' },
        gap: '6',
        alignItems: { md: 'center' },
        p: '6',
        borderRadius: 'xl',
        bg: 'gray.50',
        border: '1px solid',
        borderColor: 'gray.200',
      })}
    >
      <img
        src={photoUrl}
        alt={contact.name}
        width={80}
        height={80}
        className={css({
          borderRadius: 'full',
          flexShrink: 0,
          objectFit: 'cover',
        })}
      />
      <div className={css({ flex: 1 })}>
        <div
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: 'lg',
            color: 'ocobo.dark',
          })}
        >
          {contact.name}
        </div>
        <div
          className={css({
            fontSize: 'sm',
            color: 'ocobo.dark/60',
            mt: '1',
          })}
        >
          {contact.role}
        </div>
        {contact.shortBio && (
          <p
            className={css({
              fontSize: 'sm',
              color: 'gray.700',
              mt: '2',
            })}
          >
            {contact.shortBio}
          </p>
        )}
      </div>
    </div>
  );
}
