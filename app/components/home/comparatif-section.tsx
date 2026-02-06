import { Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { center, flex, grid } from '@ocobo/styled-system/patterns';
import { section } from '@ocobo/styled-system/recipes';

import { ButtonLink } from '~/components/ui/button-link';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { url } from '~/utils/url';

import { Container } from '../ui/Container';

interface ComparatifSectionProps {
  showStudio?: boolean;
}

export const ComparatifSection = ({
  showStudio = true,
}: ComparatifSectionProps) => {
  const { t } = useTranslation('home');
  const getLocalizedPath = useLocalizedPathname();
  const ocoboBenefits = t('comparatif.ocobo.items', {
    returnObjects: true,
  }) as string[];
  const otherIssues = t('comparatif.others.items', {
    returnObjects: true,
  }) as string[];

  return (
    <section className={section({ bg: 'dark', padding: 'lg' })}>
      <Container>
        <div className={css({ textAlign: 'center', mb: '16' })}>
          <h2
            className={css({
              fontFamily: 'display',
              fontSize: '4xl',
              fontWeight: 'bold',
              mb: '4',
            })}
          >
            {t('comparatif.title.line1')}
            <br />
            {t('comparatif.title.line2')}
          </h2>
          <p className={css({ color: 'gray.400' })}>
            {t('comparatif.subtitle')}
          </p>
        </div>

        <div
          className={`${grid({ columns: { base: 1, md: 2 }, gap: '8' })} ${css({
            maxW: '5xl',
            mx: 'auto',
          })}`}
        >
          <div
            className={css({
              bg: 'white',
              color: 'ocobo.dark',
              p: '10',
              position: 'relative',
            })}
          >
            <div
              className={css({
                position: 'absolute',
                top: '0',
                left: '0',
                bg: 'ocobo.yellow',
                color: 'ocobo.dark',
                px: '4',
                py: '1',
                fontWeight: 'bold',
                fontSize: 'xs',
                textTransform: 'uppercase',
                letterSpacing: 'widest',
              })}
            >
              {t('comparatif.ocobo.label')}
            </div>
            <h3
              className={css({
                fontFamily: 'display',
                fontSize: '2xl',
                fontWeight: 'bold',
                mb: '8',
                mt: '4',
              })}
            >
              {t('comparatif.ocobo.title')}
            </h3>
            <ul className={css({ spaceY: '4' })}>
              {ocoboBenefits.map((item) => (
                <li
                  key={item}
                  className={flex({ align: 'flex-start', gap: '3' })}
                >
                  <Check
                    className={css({
                      color: 'ocobo.mint',
                      flexShrink: '0',
                      mt: '1',
                    })}
                    size={18}
                  />
                  <span className={css({ fontWeight: 'medium' })}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={css({
              bg: 'white/5',
              borderWidth: '1px',
              borderColor: 'white/10',
              p: '10',
              color: 'gray.300',
            })}
          >
            <h3
              className={css({
                fontFamily: 'display',
                fontSize: '2xl',
                fontWeight: 'bold',
                mb: '8',
                mt: '4',
                color: 'white',
              })}
            >
              {t('comparatif.others.title')}
            </h3>
            <ul className={css({ spaceY: '4' })}>
              {otherIssues.map((item) => (
                <li
                  key={item}
                  className={flex({ align: 'flex-start', gap: '3' })}
                >
                  <X
                    className={css({
                      color: 'red.400',
                      flexShrink: '0',
                      mt: '1',
                    })}
                    size={18}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {showStudio ? (
          <div className={`${center()} ${css({ mt: '16' })}`}>
            <ButtonLink
              to={getLocalizedPath(url.studio)}
              variant="white"
              size="lg"
            >
              {t('comparatif.cta')}
            </ButtonLink>
          </div>
        ) : null}
      </Container>
    </section>
  );
};
