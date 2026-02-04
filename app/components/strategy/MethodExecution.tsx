import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { Grid, GridItem } from '@ocobo/styled-system/jsx';
import { link, subtitle } from '@ocobo/styled-system/recipes';

import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { url } from '~/utils/url';

import { Container } from '../ui/Container';
import { Illustration } from '../ui/Illustration';

const MethodExecution = () => {
  const { t } = useTranslation('strategy');
  const getLocalizedPath = useLocalizedPathname();

  const execution = [
    {
      title: t('method.execution.items.0.title'),
      description: t('method.execution.items.0.description'),
    },
    {
      title: t('method.execution.items.1.title'),
      description: t('method.execution.items.1.description'),
    },
  ];
  return (
    <div className={css({ borderBottom: 'thin', borderColor: 'dark' })}>
      <Container>
        <div
          className={cx(
            css({
              maxW: { base: 'full', lg: '5/6' },
              mx: 'auto',
              position: 'relative',
              pt: 16,
              pb: 8,
            }),
          )}
        >
          <h3
            className={cx(
              subtitle(),
              css({
                position: 'absolute',
                top: 0,
                left: 0,
                translateY: '-50%',
              }),
            )}
          >
            {t('method.execution.title')}
          </h3>

          <Grid
            columns={{ base: 1, lg: 10 }}
            alignItems="stretch"
            rowGap={{ base: 4, lg: 24 }}
          >
            <GridItem colSpan={{ base: 1, lg: 4 }}>
              <p
                className={css({
                  bleft: 'yellow',
                  textStyle: 'large',
                  fontWeight: 'bold',
                })}
              >
                {t('method.execution.subtitle')}
              </p>
              <p
                className={css({
                  mt: 8,
                  mb: 16,
                  hideBelow: 'lg',
                })}
              >
                <Illustration name="strategy_execution" />
              </p>
              <p className={css({ hideBelow: 'lg' })}>
                <NavLink to={getLocalizedPath(url.offer)} className={link()}>
                  {t('method.execution.cta')}
                </NavLink>
              </p>
            </GridItem>
            <GridItem className={css({ hideBelow: 'lg' })} />
            <GridItem
              colSpan={{ base: 1, lg: 4 }}
              className={css({ hideBelow: 'lg' })}
            >
              {Array.isArray(execution) &&
                execution.map((item, index) => {
                  return (
                    <div
                      key={`desktop-${index}`}
                      className={css({
                        mb: 8,
                      })}
                    >
                      <p
                        className={css({
                          textStyle: 'large',
                          fontWeight: 'bold',
                          pb: '4',
                          borderBottom: 'thin',
                          borderColor: 'yellow',
                        })}
                      >
                        {item.title}
                      </p>
                      <p className={css({})}>{item.description}</p>
                    </div>
                  );
                })}
            </GridItem>
            <ul
              className={css({
                hideFrom: 'lg',
                bleft: 'transparent',
                listStyleType: 'disc',
                listStylePosition: 'outside',
              })}
            >
              {Array.isArray(execution) &&
                execution.map((item, index) => {
                  return <li key={`mobile-${index}`}>{item.title}</li>;
                })}
            </ul>
            <p className={css({ hideFrom: 'lg', bleft: 'transparent' })}>
              <NavLink to={getLocalizedPath(url.offer)} className={link()}>
                {t('see_more', { ns: 'common' })}
              </NavLink>
            </p>
          </Grid>
          <div
            className={css({
              mt: 8,
              hideFrom: 'lg',
            })}
          >
            <Illustration name="strategy_execution" />
          </div>
        </div>
      </Container>
    </div>
  );
};

export { MethodExecution };
