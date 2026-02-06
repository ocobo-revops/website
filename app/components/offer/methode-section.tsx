import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { center, grid } from '@ocobo/styled-system/patterns';

import { ButtonLink } from '~/components/ui/button-link';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { url } from '~/utils/url';

import { Container } from '../ui/Container';
import { SectionHeader } from './section-header';

type Step = {
  title: string;
  description: string;
  deliverable: string;
};

export const MethodeSection = () => {
  const { t } = useTranslation('offer');
  const getLocalizedPath = useLocalizedPathname();
  const steps = t('method.steps', { returnObjects: true }) as Step[];

  return (
    <section className={css({ py: '24', bg: 'gray.50' })}>
      <Container>
        <SectionHeader title={t('method.title')} className={css({ mb: '6' })} />
        <p
          className={css({
            fontSize: 'lg',
            color: 'gray.600',
            textAlign: 'center',
            mb: '16',
          })}
        >
          {t('method.intro')}
        </p>
        <div className={grid({ columns: { base: 1, md: 4 }, gap: '6' })}>
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`group ${css({
                bg: 'white',
                p: '8',
                rounded: 'lg',
                borderWidth: '1px',
                borderColor: 'gray.100',
                transition: 'all',
                _hover: { shadow: 'lg', borderColor: 'ocobo.yellow' },
              })}`}
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
              <p
                className={css({
                  fontSize: 'sm',
                  color: 'gray.500',
                  lineHeight: 'relaxed',
                  mb: '4',
                })}
              >
                {step.description}
              </p>
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

        <h3
          className={css({
            fontFamily: 'display',
            fontSize: { base: '2xl', md: '3xl' },
            fontWeight: 'bold',
            textAlign: 'center',
            mt: '16',
            mb: '4',
            maxW: '2xl',
            mx: 'auto',
          })}
        >
          <span className={css({ color: 'ocobo.yellow' })}>
            {t('method.closing.line1')}
          </span>
          <br />
          {t('method.closing.line2')}
        </h3>

        <p
          className={css({
            fontSize: 'xs',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'gray.400',
            textAlign: 'center',
            mb: '8',
          })}
        >
          {t('method.subtitle')}
        </p>

        <div className={center()}>
          <ButtonLink
            to={getLocalizedPath(url.method)}
            variant="outline"
            size="lg"
          >
            {t('method.cta')}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
};
