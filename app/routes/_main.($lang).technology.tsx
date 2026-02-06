import { useTranslation } from 'react-i18next';
import { type LoaderFunctionArgs, type MetaFunction } from 'react-router';

import { CtaSection } from '~/components/offer/cta-section';
import { EcosystemSection } from '~/components/technology/ecosystem-section';
import { HeroSection } from '~/components/technology/hero-section';
import { PartnerFormSection } from '~/components/technology/partner-form-section';
import { PhilosophySection } from '~/components/technology/philosophy-section';
import i18nServer from '~/localization/i18n.server';
import { createHybridLoader } from '~/modules/cache';
import { throwIfDisabled } from '~/modules/feature-flags';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';
import { redirectWithLocale } from '~/utils/redirections';
import { url, getImageOgFullPath } from '~/utils/url';

export const loader = createHybridLoader(async (args: LoaderFunctionArgs) => {
  await redirectWithLocale(args);
  throwIfDisabled('technology');
  const t = await i18nServer.getFixedT(getLang(args.params), 'technology');

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    ogImageSrc: getImageOgFullPath('technology', args.request.url),
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

export default function TechnologyPage() {
  const { t } = useTranslation('technology');

  return (
    <div>
      <HeroSection />
      <PhilosophySection />
      <EcosystemSection />
      <PartnerFormSection />
      <CtaSection
        variant="sky"
        title={t('cta.title')}
        subtitle={t('cta.subtitle')}
        ctaText={t('cta.button')}
        ctaLink={url.contact}
      />
    </div>
  );
}
