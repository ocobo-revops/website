import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { grid, hstack } from '@ocobo/styled-system/patterns';

const OFFICE_PHOTOS = [
  {
    src: '/images/jobs/bureau-1.jpeg',
    alt: 'Bureaux Ocobo — espace de travail',
  },
  {
    src: '/images/jobs/bureau-2.jpeg',
    alt: 'Bureaux Ocobo — salle de réunion',
  },
  { src: '/images/jobs/bureau-3.jpeg', alt: 'Bureaux Ocobo — espace commun' },
];

const MAPS_URL = 'https://maps.google.com/?q=Cadet,+Paris+9';

export function OfficesSection() {
  const { t } = useTranslation('jobs');

  return (
    <section
      className={css({
        maxW: '7xl',
        mx: 'auto',
        px: { base: '4', sm: '6', lg: '8' },
        mb: '24',
      })}
    >
      {/* Header */}
      <div
        className={`${hstack({ justify: 'space-between', alignItems: 'flex-end' })} ${css({ mb: '10' })}`}
      >
        <div>
          <h2
            className={css({
              fontFamily: 'display',
              fontSize: { base: '3xl', md: '4xl' },
              fontWeight: 'black',
              color: 'ocobo.dark',
              letterSpacing: 'tight',
            })}
          >
            {t('offices.title')}
          </h2>
          <p
            className={css({
              fontSize: 'lg',
              color: 'gray.500',
              fontWeight: 'medium',
              mt: '2',
            })}
          >
            {t('offices.subtitle')}
          </p>
        </div>
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`${hstack({ gap: '1.5' })} ${css({
            fontSize: 'xs',
            fontWeight: 'black',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'ocobo.dark',
            borderBottomWidth: '2px',
            borderColor: 'ocobo.yellow',
            pb: '0.5',
            transition: 'colors',
            _hover: { color: 'ocobo.dark/60' },
          })}`}
        >
          {t('offices.mapsLink')}
          <ArrowUpRight size={14} />
        </a>
      </div>

      {/* Photos grid */}
      <div className={grid({ columns: 3, gap: '4' })}>
        {OFFICE_PHOTOS.map((photo) => (
          <div
            key={photo.src}
            className={cx('group', css({ rounded: '2xl', overflow: 'hidden' }))}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className={css({
                w: 'full',
                aspectRatio: '4/3',
                objectFit: 'cover',
                rounded: '2xl',
                filter: 'grayscale(100%)',
                transition: 'all 500ms',
                _groupHover: { filter: 'grayscale(0)' },
              })}
            />
          </div>
        ))}
      </div>

      {/* Coffee CTA */}
      <div
        className={cx(
          'group',
          css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', md: '3fr 2fr' },
            gap: '0',
            mt: '4',
            rounded: '2xl',
            overflow: 'hidden',
          }),
        )}
      >
        <img
          src="/images/jobs/rooftop.jpeg"
          alt="Bureaux Ocobo — rooftop"
          className={css({
            w: 'full',
            h: { base: '48', md: 'full' },
            objectFit: 'cover',
            filter: 'grayscale(100%)',
            display: { base: 'none', md: 'block' },
            transition: 'all 500ms',
            _groupHover: { filter: 'grayscale(0)' },
          })}
        />
        <div
          className={css({
            bg: 'ocobo.yellow',
            p: { base: '10', md: '14' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          })}
        >
          <h3
            className={css({
              fontFamily: 'display',
              fontSize: { base: '3xl', md: '4xl' },
              fontWeight: 'black',
              color: 'ocobo.dark',
              lineHeight: '1.05',
              letterSpacing: 'tight',
              whiteSpace: 'pre-line',
              mb: '4',
            })}
          >
            {t('about.coffee.title')}
          </h3>
          <p
            className={css({
              fontSize: 'lg',
              color: 'ocobo.dark/70',
              fontWeight: 'medium',
              lineHeight: 'relaxed',
            })}
          >
            {t('about.coffee.desc')}
          </p>
        </div>
      </div>
    </section>
  );
}
