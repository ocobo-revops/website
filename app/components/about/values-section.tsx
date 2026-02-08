import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { grid } from '@ocobo/styled-system/patterns';
import { section } from '@ocobo/styled-system/recipes';

import { Container } from '../ui/Container';
import { ValueCard } from './value-card';

type ThemeColor = 'yellow' | 'mint' | 'sky' | 'coral' | 'dark';

type Value = {
  title: string;
  description: string;
  detail: string;
  color: ThemeColor;
};

export const ValuesSection = () => {
  const { t } = useTranslation('about');
  const values = t('values.items', { returnObjects: true }) as Value[];

  return (
    <section className={section({ bg: 'dark', padding: 'lg' })}>
      <Container>
        <h2
          className={css({
            fontFamily: 'display',
            fontSize: '4xl',
            fontWeight: 'bold',
            mb: '16',
            textAlign: 'center',
            color: 'white',
          })}
        >
          {t('values.title')}
        </h2>

        <div className={grid({ columns: { base: 1, md: 2 }, gap: 12 })}>
          {values.map((value) => (
            <ValueCard
              key={value.title}
              title={value.title}
              description={value.description}
              detail={value.detail}
              color={value.color}
              variant="dark"
            />
          ))}
        </div>
      </Container>
    </section>
  );
};
