import { LoaderFunctionArgs, type MetaFunction } from 'react-router';

import { Container, Grid, GridItem } from '@ocobo/styled-system/jsx';
import { section } from '@ocobo/styled-system/recipes';

import { ContactForm } from '~/components/ContactForm';
import { ContactCard } from '~/components/contact/contact-card';
import { ContactHero } from '~/components/contact/contact-hero';
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
    <section className={section()}>
      <Container>
        <Grid columns={{ base: 1, lg: 2 }} gap="5rem">
          <GridItem>
            <ContactHero />
          </GridItem>
          <GridItem>
            <ContactCard>
              <ContactForm />
            </ContactCard>
          </GridItem>
        </Grid>
      </Container>
    </section>
  );
}
