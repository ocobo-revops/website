import { Trans, useTranslation } from 'react-i18next';
import { LoaderFunctionArgs, type MetaFunction } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { Container, Grid, GridItem } from '@ocobo/styled-system/jsx';
import { section } from '@ocobo/styled-system/recipes';

import { ContactForm } from '~/components/ContactForm';
import { Illustration } from '~/components/ui/Illustration';
import i18nServer from '~/localization/i18n.server';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';
import { redirectWithLocale } from '~/utils/redirections';
import { getImageOgFullPath } from '~/utils/url';

export async function loader(args: LoaderFunctionArgs) {
  await redirectWithLocale(args);
  const t = await i18nServer.getFixedT(getLang(args.params), 'contact');
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    ogImageSrc: getImageOgFullPath('contact', args.request.url),
  };
}

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  if (!data) {
    return [];
  }
  return getMetaTags({
    title: data.title,
    description: data.description,
    locale: getLang(params),
    image: data.ogImageSrc,
  });
};

const Description: React.FunctionComponent<
  React.HTMLAttributes<HTMLDivElement>
> = (props) => {
  const { t } = useTranslation('contact');

  const description = t('description', { returnObjects: true });

  return (
    <div {...props}>
      {Array.isArray(description) &&
        description.map((d, i) => (
          <p key={i}>
            <Trans i18nKey={d} components={[<strong key="strong" />]} />
          </p>
        ))}
    </div>
  );
};

export default function Index() {
  const { t } = useTranslation('contact');

  const title = t('title');

  return (
    <div
      className={cx(
        section(),
        css({
          position: 'relative',
        }),
      )}
    >
      <div
        className={css({
          position: 'absolute',
          top: { base: '340px', lg: '0' },
          left: { base: 0, lg: '50%' },
          right: 0,
          bottom: 0,
          bgColor: 'coral.light',
        })}
      >
        <div
          className={css({
            w: '140px',
            right: '10%',
            transform: 'translateY(-50%)',
            position: 'absolute',
            hideFrom: 'lg',
          })}
        >
          <Illustration name="contact" />
        </div>
      </div>
      <Container>
        <Grid columns={{ base: 1, lg: 2 }} gap="5rem">
          <GridItem>
            <div
              className={css({
                width: '3/4',
                mx: 'auto',
                pb: { base: '16', lg: '0' },
              })}
            >
              <h1
                className={css({
                  fontFamily: 'display',
                  fontSize: { base: '2xl', md: '3xl', lg: '4xl' },
                  fontWeight: 'bold',
                  color: 'ocobo.dark',
                  letterSpacing: 'tight',
                })}
              >
                <Trans
                  i18nKey={title}
                  components={[
                    <span
                      key="em"
                      className={css({ color: 'coral', display: 'block' })}
                    />,
                  ]}
                />
              </h1>
              <p
                className={css({
                  textStyle: 'large',
                  bleft: 'coral',
                  fontWeight: 'bold',
                  mb: '6',
                })}
              >
                {t('subtitle')}
              </p>
              <Description
                className={css({ textStyle: 'medium', hideBelow: 'lg' })}
              />
            </div>
          </GridItem>
          <GridItem className={css({})}>
            <div
              className={css({
                width: { base: 'full', xl: '2/3' },
                mx: 'auto',
                position: 'relative',
              })}
            >
              <ContactForm>
                <Description
                  className={css({
                    hideFrom: 'lg',
                    textAlign: 'center',
                    w: '2/3',
                    mx: 'auto',
                    my: '6',
                  })}
                />
              </ContactForm>
            </div>
          </GridItem>
        </Grid>
      </Container>
      <div
        className={css({
          w: '400px',
          mx: 'auto',
          transform: 'translate(-30%, -20%)',
          hideBelow: 'lg',
          position: 'relative',
        })}
      >
        <Illustration name="contact" />
      </div>
    </div>
  );
}
