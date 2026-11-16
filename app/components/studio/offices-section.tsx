import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { card, iconBox, section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';

/** Anchor of the offices section, as in the prototype. */
const OFFICES_ID = 'vie';

type Office = {
  city: string;
  note: string;
};

/** Where the team works: three offices, one team (`#vie`). */
export function OfficesSection() {
  const { t } = useTranslation('studio');
  const offices = t('offices.list', { returnObjects: true }) as Office[];

  return (
    <section
      id={OFFICES_ID}
      className={cx(section({ bg: 'gray' }), css({ scrollMarginTop: '24' }))}
    >
      <Container
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
          gap: '12',
          alignItems: 'center',
        })}
      >
        <div>
          <h2 className={cx(text({ variant: 'display-lg' }), css({ mb: '5' }))}>
            {t('offices.title')}
          </h2>
          <p className={text({ variant: 'body', color: 'muted' })}>
            {t('offices.subtitle')}
          </p>
        </div>

        <div className={cx(card({ padding: 'lg' }), css({ gap: '6' }))}>
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '2',
            })}
          >
            <p className={text({ variant: 'label', color: 'muted' })}>
              {t('offices.label')}
            </p>
            <h3 className={text({ variant: 'display-md-bold' })}>
              {t('offices.heading')}
            </h3>
          </div>
          <ul
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '4',
            })}
          >
            {offices.map((office) => (
              <li
                key={office.city}
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4',
                })}
              >
                <span
                  className={iconBox({
                    size: 'md',
                    variant: 'solid',
                    color: 'mint',
                  })}
                >
                  <MapPin size={18} aria-hidden="true" />
                </span>
                <span
                  className={css({ display: 'flex', flexDirection: 'column' })}
                >
                  <span
                    className={cx(
                      text({ variant: 'body' }),
                      css({ fontWeight: 'bold' }),
                    )}
                  >
                    {office.city}
                  </span>
                  <span className={text({ variant: 'small', color: 'muted' })}>
                    {office.note}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
