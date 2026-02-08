import { Trans, useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { Grid, GridItem } from '@ocobo/styled-system/jsx';

import { Container } from '../ui/Container';
import { Illustration } from '../ui/Illustration';

const Hero = () => {
  const { t } = useTranslation('common');

  const description = t('clients.description.items', { returnObjects: true });

  return (
    <header
      className={css({
        mt: 24,
        pb: 16,
        bg: { base: 'mint.light', lg: 'transparent' },
      })}
    >
      <Container isMobileFullWidth>
        <Grid columns={{ base: 1, lg: 12 }} alignItems="center">
          <GridItem className={css({ hideBelow: 'lg' })} />
          <GridItem
            colSpan={{ base: 1, lg: 5 }}
            className={css({
              textAlign: { base: 'center', lg: 'left' },
              maxWidth: { base: '2/3', lg: 'none' },
              mx: 'auto',
            })}
          >
            <Illustration
              name="stories_hero_mobile"
              extension="png"
              className={css({
                hideFrom: 'lg',
                maxWidth: '1/2',
                mx: 'auto',
                mt: '-50px',
                mb: '4',
              })}
            />
            <h1
              className={css({
                fontFamily: 'display',
                fontSize: { base: '3xl', md: '4xl', lg: '5xl' },
                fontWeight: 'black',
                letterSpacing: 'tight',
                color: 'ocobo.dark',
                mb: '4',
              })}
            >
              {t('clients.title')}
            </h1>
            <div
              className={css({
                pr: { base: 0, lg: '4em' },
              })}
            >
              {Array.isArray(description) &&
                description.length > 0 &&
                description.map((item, i) => (
                  <p key={`paragraph-${i}`}>
                    <Trans
                      i18nKey={item}
                      components={[<strong key="strong" />]}
                    />
                  </p>
                ))}
            </div>
          </GridItem>
          <GridItem className={css({ hideBelow: 'lg' })} />
          <GridItem
            colSpan={{ base: 1, lg: 4 }}
            className={css({ hideBelow: 'lg' })}
          >
            <Illustration name="stories_hero_desktop" extension="png" />
          </GridItem>
        </Grid>
      </Container>
    </header>
  );
};

export { Hero };
