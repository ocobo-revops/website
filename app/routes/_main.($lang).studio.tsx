import { useTranslation } from 'react-i18next';
import {
  type LoaderFunctionArgs,
  type MetaFunction,
  useLoaderData,
} from 'react-router';

import { CtaSection } from '~/components/offer/cta-section';
import { HeroSection } from '~/components/studio/hero-section';
import { ModelSection } from '~/components/studio/model-section';
import { TeamSection } from '~/components/studio/team-section';
import i18nServer from '~/localization/i18n.server';
import { createHybridLoader } from '~/modules/cache';
import {
  getActiveMembers,
  loadMemberRegistry,
} from '~/modules/content/members';
import { throwIfDisabled } from '~/modules/feature-flags';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';
import { redirectWithLocale } from '~/utils/redirections';
import { url, getImageOgFullPath } from '~/utils/url';

export const loader = createHybridLoader(async (args: LoaderFunctionArgs) => {
  await redirectWithLocale(args);
  throwIfDisabled('studio');
  const lang = getLang(args.params);
  const t = await i18nServer.getFixedT(lang, 'studio');

  const registry = await loadMemberRegistry();

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    ogImageSrc: getImageOgFullPath('studio', args.request.url),
    members: getActiveMembers(registry),
    lang,
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

export default function StudioPage() {
  const { t } = useTranslation('studio');
  const { members, lang } = useLoaderData<typeof loader>();

  return (
    <div>
      <HeroSection />
      <ModelSection />
      <TeamSection members={members} lang={lang} />
      <CtaSection
        variant="mint"
        title={t('cta.title')}
        subtitle={t('cta.subtitle')}
        ctaText={t('cta.button')}
        ctaLink={url.contact}
      />
    </div>
  );
}
