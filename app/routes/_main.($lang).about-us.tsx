import { useTranslation } from 'react-i18next';
import {
  type LoaderFunctionArgs,
  type MetaFunction,
  useLoaderData,
} from 'react-router';

import { HeroSection } from '~/components/about/hero-section';
import { ManifestoSection } from '~/components/about/manifesto-section';
import { TeamSection } from '~/components/about/team-section';
import { ValuesSection } from '~/components/about/values-section';
import { CtaSection } from '~/components/offer/cta-section';
import i18nServer from '~/localization/i18n.server';
import { createHybridLoader } from '~/modules/cache';
import { isPageEnabled } from '~/modules/feature-flags';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';
import { redirectWithLocale } from '~/utils/redirections';
import { url, getImageOgFullPath } from '~/utils/url';

export const loader = createHybridLoader(async (args: LoaderFunctionArgs) => {
  await redirectWithLocale(args);
  const t = await i18nServer.getFixedT(getLang(args.params), 'about');

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    ogImageSrc: getImageOgFullPath('strategy', args.request.url),
    showStudio: isPageEnabled('studio'),
  };
}, 'static');

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  if (!data) {
    return [];
  }
  return getMetaTags({
    title: data.title,
    description: data.description,
    image: data.ogImageSrc,
    locale: getLang(params),
  });
};

export default function AboutPage() {
  const { t } = useTranslation('about');
  const { showStudio } = useLoaderData<typeof loader>();

  return (
    <div>
      <HeroSection />
      <ManifestoSection />
      <TeamSection showStudio={showStudio} />
      <ValuesSection />
      <CtaSection
        variant="yellow"
        title={t('cta.title')}
        subtitle={t('cta.subtitle')}
        ctaText={t('cta.button')}
        ctaLink={url.contact}
      />
    </div>
  );
}
