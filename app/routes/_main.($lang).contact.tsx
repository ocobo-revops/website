import { LoaderFunctionArgs, type MetaFunction } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { Container, Grid, GridItem } from '@ocobo/styled-system/jsx';
import { section } from '@ocobo/styled-system/recipes';

import { ContactForm } from '~/components/ContactForm';
import { ContactCard } from '~/components/contact/contact-card';
import { ContactHero } from '~/components/contact/contact-hero';
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

export default function Index() {
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
            <ContactHero />
          </GridItem>
          <GridItem>
            <div
              className={css({
                width: { base: 'full', xl: '2/3' },
                mx: 'auto',
                position: 'relative',
              })}
            >
              <ContactCard>
                <ContactForm />
              </ContactCard>
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
