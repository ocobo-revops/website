import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { card, section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';

/** Anchor of the offices section, as in the prototype. */
const OFFICES_ID = 'vie';

type Office = {
  city: string;
  note: string;
};

// One static class per office, in `offices.list` order: Paris, Bordeaux,
// Marseille. Panda only ships literal values.
const dotColours = [
  css({ bg: 'dark' }),
  css({ bg: 'yellow' }),
  css({ bg: 'mint' }),
] as const;
const pinColours = [
  css({ fill: 'dark' }),
  css({ fill: 'yellow' }),
  css({ fill: 'mint' }),
] as const;

/** Pin and label positions on the map, in `offices.list` order. */
const pins = [
  { x: 52, y: 24, r: 2.6, labelX: 56, labelY: 23 },
  { x: 28, y: 60, r: 2.8, labelX: 32, labelY: 62 },
  { x: 70, y: 82, r: 2.8, labelX: 58, labelY: 77 },
] as const;

const FRANCE_OUTLINE =
  'M52,2 L62,8 L72,12 L80,16 L88,22 L86,35 L82,48 L86,60 L88,72 L90,76 L80,80 L72,82 L62,84 L56,88 L52,92 L40,90 L30,88 L24,84 L26,74 L28,66 L26,58 L22,46 L14,40 L2,35 L6,28 L20,28 L28,22 L38,20 L44,12 Z';

/** Office photos from the jobs page, the first one wide. */
const photos = [
  { src: '/images/jobs/seminaire.jpeg', altKey: 'offices.photos.seminar' },
  { src: '/images/jobs/rooftop.jpeg', altKey: 'offices.photos.rooftop' },
  { src: '/images/jobs/cafet.jpeg', altKey: 'offices.photos.cafeteria' },
  { src: '/images/jobs/bureau-1.jpeg', altKey: 'offices.photos.workspace' },
  { src: '/images/jobs/bureau-2.jpeg', altKey: 'offices.photos.meetingRoom' },
] as const;

const land = css({ fill: 'gray.100', stroke: 'gray.300' });
const route = css({ fill: '[none]', stroke: 'gray.400' });
const pinStroke = css({ stroke: 'dark' });
const pinLabel = css({ fill: 'dark', fontWeight: 'bold' });

const row = css({
  display: 'flex',
  alignItems: 'center',
  gap: '4',
  py: '4',
  borderTopWidth: '1px',
  borderColor: 'line',
  _last: { borderBottomWidth: '1px' },
});
const dot = css({
  flex: 'none',
  w: '3.5',
  h: '3.5',
  borderRadius: 'full',
  borderWidth: '2px',
  borderColor: 'dark',
});
const gallery = css({
  display: 'grid',
  gridTemplateColumns: {
    base: 'repeat(2, minmax(0, 1fr))',
    md: 'repeat(4, minmax(0, 1fr))',
  },
  gridAutoRows: { base: '[10rem]', md: '[14rem]' },
  gap: '4',
  mt: '6',
});
const widePhoto = css({ gridColumn: 'span 2', gridRow: 'span 2' });
const photoStyle = css({
  w: 'full',
  h: 'full',
  objectFit: 'cover',
  borderRadius: '2xl',
});

function FranceMap({ offices }: { offices: Office[] }) {
  return (
    <svg
      viewBox="-2 -2 104 104"
      // Decorative: the city list before it carries the same facts.
      aria-hidden="true"
      className={css({ w: 'full', maxW: 'md', mx: 'auto' })}
    >
      <path d={FRANCE_OUTLINE} className={land} strokeWidth="0.6" />
      <ellipse
        cx="95"
        cy="90"
        rx="2.6"
        ry="5"
        className={land}
        strokeWidth="0.6"
      />
      <path
        d="M52,24 Q36,38 28,60 M52,24 Q66,48 70,82"
        className={route}
        strokeWidth="0.5"
        strokeDasharray="1.5 1.5"
      />
      {offices.slice(0, pins.length).map((office, index) => {
        const pin = pins[index];
        return (
          <g key={office.city}>
            <circle
              cx={pin.x}
              cy={pin.y}
              r={pin.r}
              className={cx(pinColours[index], index > 0 && pinStroke)}
              strokeWidth="0.7"
            />
            <text
              x={pin.labelX}
              y={pin.labelY}
              fontSize="5"
              className={pinLabel}
            >
              {office.city}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Where the team works (`#vie`): the cities with a map, then photos of the
 * offices and the seminar.
 */
export function OfficesSection() {
  const { t } = useTranslation('studio');
  const offices = t('offices.list', { returnObjects: true }) as Office[];

  return (
    <section
      id={OFFICES_ID}
      className={cx(section({ bg: 'gray' }), css({ scrollMarginTop: '24' }))}
    >
      <Container>
        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: {
              base: '1fr',
              lg: 'repeat(2, minmax(0, 1fr))',
            },
            gap: { base: '5', lg: '12' },
            alignItems: 'end',
            mb: '12',
          })}
        >
          <h2 className={text({ variant: 'display-lg' })}>
            {t('offices.title')}
          </h2>
          <p className={text({ variant: 'body', color: 'muted' })}>
            {t('offices.subtitle')}
          </p>
        </div>

        <div
          className={cx(
            card({ padding: 'xl', radius: 'lg' }),
            css({
              display: 'grid',
              gridTemplateColumns: {
                base: '1fr',
                lg: 'repeat(2, minmax(0, 1fr))',
              },
              gap: { base: '10', lg: '16' },
              alignItems: 'center',
            }),
          )}
        >
          <div>
            <p
              className={cx(
                text({ variant: 'label', color: 'muted' }),
                css({ mb: '2' }),
              )}
            >
              {t('offices.label')}
            </p>
            <h3
              className={cx(
                text({ variant: 'display-md-black' }),
                css({ mb: '6' }),
              )}
            >
              {t('offices.heading')}
            </h3>
            <ul>
              {offices.map((office, index) => (
                <li key={office.city} className={row}>
                  <span
                    aria-hidden="true"
                    className={cx(dot, dotColours[index % dotColours.length])}
                  />
                  <span
                    className={cx(
                      text({ variant: 'display-md-black' }),
                      css({ flex: '1' }),
                    )}
                  >
                    {office.city}
                  </span>
                  <span className={text({ variant: 'small', color: 'muted' })}>
                    {office.note}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <FranceMap offices={offices} />
        </div>

        <ul className={gallery}>
          {photos.map((photo, index) => (
            <li key={photo.src} className={index === 0 ? widePhoto : undefined}>
              <img
                src={photo.src}
                alt={t(photo.altKey)}
                loading="lazy"
                className={photoStyle}
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
