import { useTranslation } from 'react-i18next';
import { type LoaderFunctionArgs, type MetaFunction } from 'react-router';

import { HeroSection } from '~/components/method/hero-section';
import { PillarsSection } from '~/components/method/pillars-section';
import { ScopeSection } from '~/components/method/scope-section';
import { CtaSection } from '~/components/offer/cta-section';
import i18nServer from '~/localization/i18n.server';
import { createHybridLoader } from '~/modules/cache';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';
import { redirectWithLocale } from '~/utils/redirections';
import { url, getImageOgFullPath } from '~/utils/url';

export const loader = createHybridLoader(async (args: LoaderFunctionArgs) => {
  await redirectWithLocale(args);
  const t = await i18nServer.getFixedT(getLang(args.params), 'method');

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

export default function MethodPage() {
  const { t } = useTranslation('method');

  return (
    <div>
      <HeroSection />
      <PillarsSection />
      <ScopeSection />
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
