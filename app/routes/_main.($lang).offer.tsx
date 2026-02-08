import { useTranslation } from 'react-i18next';
import { type LoaderFunctionArgs, type MetaFunction } from 'react-router';

import { CtaSection } from '~/components/offer/cta-section';
import { HeroSection } from '~/components/offer/hero-section';
import { ImplicationsSection } from '~/components/offer/implications-section';
import { LeviersSection } from '~/components/offer/leviers-section';
import { MethodeSection } from '~/components/offer/methode-section';
import { OffersDetailSection } from '~/components/offer/offers-detail-section';
import { SymptomsSection } from '~/components/offer/symptoms-section';
import { TransitionSection } from '~/components/offer/transition-section';
import { WhyOcoboSection } from '~/components/offer/why-ocobo-section';
import i18nServer from '~/localization/i18n.server';
import { createHybridLoader } from '~/modules/cache';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';
import { redirectWithLocale } from '~/utils/redirections';
import { url, getImageOgFullPath } from '~/utils/url';

export const loader = createHybridLoader(async (args: LoaderFunctionArgs) => {
  await redirectWithLocale(args);
  const t = await i18nServer.getFixedT(getLang(args.params), 'offer');

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    ogImageSrc: getImageOgFullPath('strategy', args.request.url),
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

export default function OfferPage() {
  const { t } = useTranslation('offer');

  return (
    <div>
      <HeroSection />
      <SymptomsSection />
      <TransitionSection />
      <OffersDetailSection />
      <LeviersSection />
      <MethodeSection />
      <ImplicationsSection />
      <WhyOcoboSection />
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
