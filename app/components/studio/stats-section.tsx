import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';

type Stat = {
  value: string;
  label: string;
};

// One static class per stat, in copy order: yellow, mint, sky.
const valueTones = [
  css({ color: 'yellow' }),
  css({ color: 'mint' }),
  css({ color: 'sky' }),
];

/**
 * Team figures on a dark band, three columns from tablet width, one below.
 */
export function StatsSection() {
  const { t } = useTranslation('studio');
  const stats = t('stats.list', { returnObjects: true }) as Stat[];
  const titleId = React.useId();

  return (
    <section aria-labelledby={titleId} className={section({ bg: 'dark' })}>
      <Container>
        <h2 id={titleId} className={css({ srOnly: true })}>
          {t('stats.title')}
        </h2>
        <ul
          className={css({
            display: 'grid',
            gridTemplateColumns: {
              base: '1fr',
              md: 'repeat(3, minmax(0, 1fr))',
            },
            gap: { base: '10', md: '12' },
            textAlign: 'center',
          })}
        >
          {stats.map((stat, index) => (
            <li key={stat.label}>
              <p
                className={cx(
                  text({ variant: 'display-xl' }),
                  valueTones[index % valueTones.length],
                )}
              >
                {stat.value}
              </p>
              <p
                className={cx(
                  text({ variant: 'body' }),
                  css({ mt: '3', color: 'white/75', fontWeight: 'medium' }),
                )}
              >
                {stat.label}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
