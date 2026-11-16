import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';

type CompaniesStripProps = {
  /** Previous companies of the team, from the member files. */
  companies: string[];
};

/** "Before Ocobo, we worked at": the team's previous companies, as text. */
export function CompaniesStrip({ companies }: CompaniesStripProps) {
  const { t } = useTranslation('studio');
  if (companies.length === 0) return null;

  return (
    <section
      aria-label={t('companies.label')}
      className={css({
        py: '10',
        borderTopWidth: '1px',
        borderBottomWidth: '1px',
        borderColor: 'line',
      })}
    >
      <Container
        className={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '5',
          textAlign: 'center',
        })}
      >
        <p className={text({ variant: 'label', color: 'muted' })}>
          {t('companies.label')}
        </p>
        <ul
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            columnGap: '10',
            rowGap: '3',
          })}
        >
          {companies.map((company) => (
            <li
              key={company}
              className={text({ variant: 'display-md-bold', color: 'muted' })}
            >
              {company}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
