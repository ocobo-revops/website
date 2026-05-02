import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { grid, hstack } from '@ocobo/styled-system/patterns';

const OFFICE_PHOTOS = [
  {
    src: 'https://ocobo.notion.site/image/attachment%3Adb312e67-298e-4876-8626-903ffc82f480%3AIMG_1081.jpeg?table=block&id=20f3e6cb-c845-8016-ad4f-f1c4f9745781&spaceId=4e81b96a-f81b-4af5-bdaa-63b1b40bfa58&width=550&userId=&cache=v2',
    alt: 'Bureaux Ocobo — espace de travail',
  },
  {
    src: 'https://ocobo.notion.site/image/attachment%3Ae0e520b7-e1cb-4501-a4a0-c0c66670428a%3AIMG_1083.jpeg?table=block&id=20f3e6cb-c845-8038-afa1-e52f285de4da&spaceId=4e81b96a-f81b-4af5-bdaa-63b1b40bfa58&width=550&userId=&cache=v2',
    alt: 'Bureaux Ocobo — salle de réunion',
  },
  {
    src: 'https://ocobo.notion.site/image/attachment%3A29c60272-e6f6-4203-a581-88165d1c1fdd%3AIMG_1082.jpeg?table=block&id=20f3e6cb-c845-80e6-bbb7-e838ca5e27b5&spaceId=4e81b96a-f81b-4af5-bdaa-63b1b40bfa58&width=550&userId=&cache=v2',
    alt: 'Bureaux Ocobo — espace commun',
  },
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
          src="https://ocobo.notion.site/image/attachment%3A4434f27a-8380-47d2-b912-63560172de73%3Arooftop.jpeg?table=block&id=20f3e6cb-c845-8083-9ab0-dfbbda80b43a&spaceId=4e81b96a-f81b-4af5-bdaa-63b1b40bfa58&width=550&userId=&cache=v2"
          alt="Bureaux Ocobo — rooftop"
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
