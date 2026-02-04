import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { center, grid } from '@ocobo/styled-system/patterns';

import { Container } from '../ui/Container';
import { SectionHeader } from './section-header';

type Step = {
  title: string;
  deliverable: string;
};

export const MethodeSection = () => {
  const { t } = useTranslation('offer');
  const steps = t('method.steps', { returnObjects: true }) as Step[];

  return (
    <section className={css({ py: '24', bg: 'gray.50' })}>
      <Container>
        <SectionHeader
          title={t('method.title')}
          className={css({ mb: '16' })}
        />
        <div className={grid({ columns: { base: 1, md: 4 }, gap: '6' })}>
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={css({
                bg: 'white',
                p: '8',
                borderWidth: '1px',
                borderColor: 'gray.100',
                transition: 'all',
                _hover: { shadow: 'lg' },
              })}
            >
              <div
                className={`${center()} ${css({
                  w: '10',
                  h: '10',
                  bg: 'ocobo.dark',
                  color: 'white',
                  fontSize: 'sm',
                  fontWeight: 'bold',
                  mb: '6',
                  _groupHover: { bg: 'ocobo.yellow', color: 'ocobo.dark' },
                  transition: 'colors',
                })}`}
              >
                {index + 1}
              </div>
              <h3
                className={css({
                  fontFamily: 'display',
                  fontSize: 'xl',
                  fontWeight: 'bold',
                  color: 'ocobo.dark',
                  mb: '3',
                })}
              >
                {step.title}
              </h3>
              <div
                className={css({
                  pt: '4',
                  borderTopWidth: '1px',
                  borderColor: 'gray.50',
                })}
              >
                <span
                  className={css({
                    fontSize: 'xs',
                    fontWeight: 'black',
                    textTransform: 'uppercase',
                    color: 'gray.400',
                  })}
                >
                  {t('method.deliverableLabel')}
                </span>
                <p
                  className={css({
                    fontSize: 'xs',
                    fontWeight: 'bold',
                    color: 'ocobo.dark',
                    mt: '1',
                  })}
                >
                  {step.deliverable}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
