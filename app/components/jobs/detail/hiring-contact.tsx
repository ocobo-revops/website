import { css } from '@ocobo/styled-system/css';
import { useTranslation } from 'react-i18next';

import { ASSETS_BASE_URL } from '~/config/assets';
import type { HiringContact as HiringContactData } from '~/modules/schemas';

type HiringContactProps = {
  contact: HiringContactData;
  applyEmail: string;
  jobTitle: string;
};

export function HiringContact({
  contact,
  applyEmail,
  jobTitle,
}: HiringContactProps) {
  const { t } = useTranslation('jobs');
  const photoUrl = `${ASSETS_BASE_URL}/team/${contact.photo}`;
  const mailtoSubject = encodeURIComponent(
    t('cta.applySubject', { title: jobTitle }),
  );

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
      <a
        href={`mailto:${applyEmail}?subject=${mailtoSubject}`}
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: '6',
          py: '3',
          borderRadius: 'lg',
          bg: 'ocobo.dark',
          color: 'white',
          fontWeight: 'semibold',
          fontSize: 'sm',
          flexShrink: 0,
          _hover: { bg: 'ocobo.dark/80' },
          transition: 'background 0.15s',
        })}
      >
        {t('cta.apply')}
      </a>
    </div>
  );
}
