import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { center, flex } from '@ocobo/styled-system/patterns';
import { section } from '@ocobo/styled-system/recipes';

import { ButtonLink } from '~/components/ui/button-link';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { url } from '~/utils/url';

import { Container } from '../ui/Container';
import { FlexPair } from './flex-pair';

type TransformationItem = {
  title: string;
  description: string;
};

type MethodItem = {
  title: string;
  description: string;
  colour: 'yellow' | 'sky' | 'mint' | 'coral';
};

const methodItemStyles: Record<MethodItem['colour'], string> = {
  yellow: css({
    p: '4',
    bg: 'ocobo.yellow.light',
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
    borderColor: 'ocobo.yellow',
  }),
  sky: css({
    p: '4',
    bg: 'ocobo.sky.light',
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
    borderColor: 'ocobo.sky',
  }),
  mint: css({
    p: '4',
    bg: 'ocobo.mint.light',
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
    borderColor: 'ocobo.mint',
  }),
  coral: css({
    p: '4',
    bg: 'ocobo.coral.light',
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
    borderColor: 'ocobo.coral',
  }),
};

export const TransformationSection = () => {
  const { t } = useTranslation('home');
  const getLocalizedPath = useLocalizedPathname();
  const items = t('transformation.items', {
    returnObjects: true,
  }) as TransformationItem[];
  const methodItems = t('transformation.method.items', {
    returnObjects: true,
  }) as MethodItem[];

  return (
    <section className={section({ bg: 'gray', padding: 'lg' })}>
      <Container>
        <div
          className={flex({
            direction: { base: 'column', md: 'row' },
            align: 'center',
            gap: '16',
          })}
        >
          <div className={css({ w: { md: '1/2' } })}>
            <h2
              className={css({
                fontFamily: 'display',
                fontSize: '4xl',
                fontWeight: 'bold',
                color: 'ocobo.dark',
                mb: '6',
              })}
            >
              {t('transformation.title')}
            </h2>
            <p
              className={css({
                color: 'gray.600',
                fontSize: 'lg',
                mb: '8',
                lineHeight: 'relaxed',
              })}
            >
              {t('transformation.description')}
            </p>
            <ul className={css({ spaceY: '6' })}>
              {items.map((item, index) => (
                <li key={item.title}>
                  <FlexPair gap={4}>
                    <FlexPair.Icon>
                      <div
                        className={`${center()} ${css({
                          w: '12',
                          h: '12',
                          bg: 'white',
                          rounded: 'full',
                          color: 'ocobo.dark',
                          shadow: 'sm',
                          fontWeight: 'bold',
                          borderWidth: '1px',
                          borderColor: 'gray.100',
                        })}`}
                      >
                        {index + 1}
                      </div>
                    </FlexPair.Icon>
                    <FlexPair.Content>
                      <h4
                        className={css({ fontWeight: 'bold', fontSize: 'lg' })}
                      >
                        {item.title}
                      </h4>
                      <p
                        className={css({ fontSize: 'base', color: 'gray.600' })}
                      >
                        {item.description}
                      </p>
                    </FlexPair.Content>
                  </FlexPair>
                </li>
              ))}
            </ul>
          </div>
          <div
            className={css({
              w: { md: '1/2' },
              bg: 'white',
              p: '10',
              shadow: 'xl',
              borderWidth: '1px',
              borderColor: 'gray.100',
              rounded: 'none',
              position: 'relative',
            })}
          >
            <div
              className={css({
                position: 'absolute',
                top: '0',
                left: '0',
                w: 'full',
                h: '1',
                bgGradient: 'to-r',
                gradientFrom: 'ocobo.yellow',
                gradientVia: 'ocobo.coral',
                gradientTo: 'ocobo.sky',
              })}
            />
            <h3
              className={css({
                fontFamily: 'display',
                fontSize: '2xl',
                fontWeight: 'bold',
                mb: '8',
                textAlign: 'center',
              })}
            >
              {t('transformation.method.title.line1')}
              <br />
              {t('transformation.method.title.line2')}
            </h3>
            <div className={css({ spaceY: '4' })}>
              {methodItems.map((item) => {
                return (
                  <div
                    key={item.title}
                    className={methodItemStyles[item.colour]}
                  >
                    <span
                      className={css({
                        fontWeight: 'bold',
                        color: 'ocobo.dark',
                      })}
                    >
                      {item.title}
                    </span>
                    <p className={css({ fontSize: 'sm', color: 'gray.600' })}>
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className={css({ mt: '8', textAlign: 'center' })}>
              <p
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontSize: 'sm',
                  textTransform: 'uppercase',
                  letterSpacing: 'wider',
                  mb: '4',
                })}
              >
                {t('transformation.method.label')}
              </p>
              <ButtonLink
                to={getLocalizedPath(url.method)}
                variant="solid"
                size="lg"
              >
                {t('transformation.method.cta')}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
