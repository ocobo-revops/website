import { Trans, useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { Grid, GridItem } from '@ocobo/styled-system/jsx';
import { container } from '@ocobo/styled-system/patterns';
import { link, section } from '@ocobo/styled-system/recipes';

import { url } from '~/utils/url';

import { Card } from '../ui/Card';
import { Container } from '../ui/Container';
import { Illustration } from '../ui/Illustration';

const Stronger = () => {
  const { t } = useTranslation('home');

  return (
    <section className={css({ pos: 'relative' })}>
      <div
        className={css({
          layerStyle: 'reversed',
          w: 'full',
          h: { base: '520px', lg: '320px' },
          pos: 'absolute',
          bottom: '0',
        })}
      />
      <div className={css({ pos: 'relative' })}>
        <div
          className={css({
            bg: 'dark',
            w: '100%',
            h: '1px',
            pos: 'absolute',
            top: '50%',
            hideBelow: 'lg',
          })}
        />
        <div
          className={container({
            maxWidth: '400px',
            px: '12',
            bg: 'white',
          })}
        >
          <Illustration name="homepage_stronger" alt="" />
        </div>
      </div>

      <Container
        className={css({
          pt: { base: '8', md: '16', xl: '24' },
        })}
      >
        <div
          className={container({
            maxWidth: { base: 'full', lg: '1/2' },
            textAlign: 'center',
            px: '0',
          })}
        >
          <h2
            className={css({
              textStyle: 'heading1',
            })}
          >
            {t('stronger.title')}
          </h2>
          <p
            className={css({
              textStyle: 'large',
            })}
          >
            {t('stronger.description')}
          </p>
        </div>

        <Grid
          columns={{ base: 1, lg: 12 }}
          alignItems="stretch"
          className={cx(section())}
        >
          <GridItem className={css({ hideBelow: 'lg' })} />
          <GridItem colSpan={{ base: 1, lg: 5 }}>
            <Card.Root
              variant="yellow"
              isColoured
              className={css({ h: 'full' })}
            >
              <Card.Title>{t('stronger.cards.0.title')}</Card.Title>
              <Card.Content>
                <div className={css({ textStyle: 'large' })}>
                  <Trans
                    i18nKey="stronger.cards.0.description"
                    components={[<strong key="strong" />]}
                    ns="home"
                  />
                </div>
                <div className={css({ hideBelow: 'lg', textStyle: 'small' })}>
                  {t('stronger.cards.0.caption')}
                </div>
                <div
                  className={css({ mt: 'auto', pt: '4', textStyle: 'small' })}
                >
                  <NavLink to={url.offer} className={link()}>
                    {t('see_more', { ns: 'common' })}
                  </NavLink>
                </div>
              </Card.Content>
            </Card.Root>
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 5 }}>
            <Card.Root variant="sky" isColoured className={css({ h: 'full' })}>
              <Card.Title>{t('stronger.cards.1.title')}</Card.Title>
              <Card.Content>
                <div className={css({ textStyle: 'large' })}>
                  <Trans
                    i18nKey="stronger.cards.1.description"
                    components={[<strong key="strong" />]}
                    ns="home"
                  />
                </div>
                <div className={css({ hideBelow: 'lg', textStyle: 'small' })}>
                  {t('stronger.cards.1.caption')}
                </div>
                <div
                  className={css({ mt: 'auto', pt: '4', textStyle: 'small' })}
                >
                  <NavLink to={url.offer} className={link()}>
                    {t('see_more', { ns: 'common' })}
                  </NavLink>
                </div>
              </Card.Content>
            </Card.Root>
          </GridItem>
        </Grid>
      </Container>
    </section>
  );
};

export { Stronger };
