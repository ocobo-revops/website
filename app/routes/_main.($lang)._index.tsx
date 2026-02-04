import { useTranslation } from 'react-i18next';
import { type LoaderFunctionArgs, type MetaFunction } from 'react-router';
import { useLoaderData } from 'react-router';

import { ComparatifSection } from '~/components/home/comparatif-section';
import { CtaSection } from '~/components/home/cta-section';
import { HeroSection } from '~/components/home/hero-section';
import { InterventionsSection } from '~/components/home/interventions-section';
import { PainPointSection } from '~/components/home/pain-point-section';
import { SocialProofSection } from '~/components/home/social-proof-section';
import { StackSection } from '~/components/home/stack-section';
import { TransformationSection } from '~/components/home/transformation-section';
import i18nServer from '~/localization/i18n.server';
import { createHybridLoader } from '~/modules/cache';
import { isPageEnabled } from '~/modules/feature-flags';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';
import { redirectWithLocale } from '~/utils/redirections';
import { url, getImageOgFullPath } from '~/utils/url';

export const loader = createHybridLoader(async (args: LoaderFunctionArgs) => {
  await redirectWithLocale(args);
  const t = await i18nServer.getFixedT(getLang(args.params), 'home');

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    ogImageSrc: getImageOgFullPath('homepage', args.request.url),
    showStudio: isPageEnabled('studio'),
    showTechnology: isPageEnabled('technology'),
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

export default function Index() {
  const { showStudio, showTechnology } = useLoaderData<typeof loader>();
  const { t } = useTranslation('home');

  return (
    <div>
      <HeroSection />
      <SocialProofSection />
      <PainPointSection />
      <TransformationSection />
      <InterventionsSection />
      <ComparatifSection showStudio={showStudio} />
      <StackSection showTechnology={showTechnology} />
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
