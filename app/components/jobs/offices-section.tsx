import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { grid, hstack } from '@ocobo/styled-system/patterns';

const OFFICE_PHOTOS = [
  {
    src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    alt: 'Bureau Ocobo — espace de travail',
  },
  {
    src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80',
    alt: 'Bureau Ocobo — salle de réunion',
  },
  {
    src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80',
    alt: 'Bureau Ocobo — espace commun',
  },
];

const MAPS_URL = 'https://maps.google.com/?q=9ème+arrondissement+Paris';

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
          <img
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            className={css({
              w: 'full',
              aspectRatio: '4/3',
              objectFit: 'cover',
              rounded: '2xl',
              filter: 'grayscale(100%)',
            })}
          />
        ))}
      </div>

      {/* Coffee CTA */}
      <div
        className={`${css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', md: '3fr 2fr' },
          gap: '0',
          mt: '4',
          rounded: '2xl',
          overflow: 'hidden',
        })}`}
      >
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80"
          alt="Bureaux Ocobo"
          className={css({
            w: 'full',
            h: { base: '48', md: 'full' },
            objectFit: 'cover',
            filter: 'grayscale(100%)',
            display: { base: 'none', md: 'block' },
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
