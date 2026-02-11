import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';

const logos = [
  { name: 'TheFork', src: '/images/experience/thefork.png' },
  { name: 'Tripadvisor', src: '/images/experience/tripadvisor.png' },
  { name: 'Spendesk', src: '/images/experience/spendesk.png' },
  { name: 'Yousign', src: '/images/experience/yousign.png' },
  { name: 'Deloitte', src: '/images/experience/deloitte.png' },
];

export const ExperienceLogos = () => {
  const { t } = useTranslation('about');

  return (
    <div className={css({ mt: '16', textAlign: 'center' })}>
      <p
        className={css({
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
          fontSize: 'base',
          fontWeight: 'semibold',
          color: 'ocobo.dark/30',
          mb: '10',
        })}
      >
        {t('team.experience.title')}
      </p>
      <div
        className={flex({
          wrap: 'wrap',
          justify: 'center',
          align: 'center',
          gap: { base: '4', md: '8' },
        })}
      >
        {logos.map((logo) => (
          <img
            key={logo.name}
            src={logo.src}
            alt={logo.name}
            loading="lazy"
            className={css({
              h: '6',
              w: 'auto',
              objectFit: 'contain',
              filter: 'grayscale(1)',
              opacity: 0.3,
              transition: 'all 0.3s ease',
              _hover: {
                filter: 'grayscale(0)',
                opacity: 1,
              },
            })}
          />
        ))}
      </div>
    </div>
  );
};
