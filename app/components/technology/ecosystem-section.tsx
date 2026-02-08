import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { flex, grid } from '@ocobo/styled-system/patterns';

import { PartnerCardFromData, type PartnerData } from './partner-card';

const CATEGORIES = [
  'TOUS',
  'CRM',
  'AI',
  'NO-CODE',
  'ENABLEMENT',
  'COMP',
  'CS',
  'SALES',
  'FINANCE',
  'CONTRAT',
] as const;

type Category = (typeof CATEGORIES)[number];

const filterPartners = (
  partners: PartnerData[],
  filter: Category,
): PartnerData[] => {
  const filtered =
    filter === 'TOUS'
      ? partners
      : partners.filter((p) => p.category.includes(filter));

  return [...filtered].sort((a, b) => {
    if (a.status === 'OFFICIAL' && b.status !== 'OFFICIAL') return -1;
    if (a.status !== 'OFFICIAL' && b.status === 'OFFICIAL') return 1;
    return 0;
  });
};

export const EcosystemSection = () => {
  const { t } = useTranslation('technology');
  const [filter, setFilter] = useState<Category>('TOUS');
  const [animate, setAnimate] = useState(false);

  const partners = t('partners', { returnObjects: true }) as PartnerData[];
  const filters = t('ecosystem.filters', {
    returnObjects: true,
  }) as Record<string, string>;
  const categoryLabels = t('ecosystem.categoryLabels', {
    returnObjects: true,
  }) as Record<string, string>;

  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => setAnimate(true), 10);
    return () => clearTimeout(timer);
  }, [filter]);

  const filtered = filterPartners(partners, filter);

  return (
    <section className={css({ py: '24', bg: 'white' })}>
      <div
        className={css({
          maxW: '7xl',
          mx: 'auto',
          px: { base: '4', sm: '6', lg: '8' },
        })}
      >
        <div
          className={`${flex({
            direction: { base: 'column', md: 'row' },
            justify: 'space-between',
            align: 'end',
            gap: '8',
          })} ${css({ mb: '20' })}`}
        >
          <div>
            <h2
              className={css({
                fontFamily: 'display',
                fontSize: '4xl',
                fontWeight: 'black',
                mb: '4',
                color: 'ocobo.dark',
                letterSpacing: 'tight',
              })}
            >
              {t('ecosystem.title')}
            </h2>
            <p className={css({ color: 'gray.500', fontWeight: 'medium' })}>
              {t('ecosystem.subtitle')}
            </p>
          </div>
          <div className={flex({ wrap: 'wrap', gap: '2' })}>
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setFilter(cat)}
                className={css({
                  px: '6',
                  py: '2.5',
                  rounded: 'full',
                  fontSize: 'xs',
                  fontWeight: 'black',
                  textTransform: 'uppercase',
                  letterSpacing: 'widest',
                  transition: 'all',
                  borderWidth: '1px',
                  bg: filter === cat ? 'ocobo.dark' : 'gray.50',
                  color: filter === cat ? 'white' : 'gray.500',
                  borderColor: filter === cat ? 'ocobo.dark' : 'gray.100',
                  shadow: filter === cat ? 'lg' : 'none',
                  _hover: filter !== cat ? { borderColor: 'ocobo.dark' } : {},
                })}
              >
                {filters[cat] ?? cat}
              </button>
            ))}
          </div>
        </div>

        <div
          className={`${grid({
            columns: { base: 1, md: 2, lg: 3 },
            gap: '8',
          })} ${css({ transition: 'all', transitionDuration: '500ms' })}`}
        >
          {filtered.map((partner) => (
            <PartnerCardFromData
              key={`${partner.name}-${filter}`}
              partner={partner}
              animate={animate}
              categoryLabels={categoryLabels}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
