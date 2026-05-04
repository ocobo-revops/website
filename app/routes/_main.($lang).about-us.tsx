import { useTranslation } from 'react-i18next';
import {
  type LoaderFunctionArgs,
  type MetaFunction,
  useLoaderData,
} from 'react-router';

import { HeroSection } from '~/components/about/hero-section';
import { ManifestoSection } from '~/components/about/manifesto-section';
import { ReassuranceSection } from '~/components/about/reassurance-section';
import {
  TeamSection,
  type TeamSectionMember,
} from '~/components/about/team-section';
import { ValuesSection } from '~/components/about/values-section';
import { CtaSection } from '~/components/offer/cta-section';
import i18nServer from '~/localization/i18n.server';
import { createHybridLoader } from '~/modules/cache';
import { getFeaturedAboutMembers, loadMemberRegistry } from '~/modules/content';
import { isPageEnabled } from '~/modules/feature-flags';
import type { MemberTrack } from '~/modules/schemas';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';
import { redirectWithLocale } from '~/utils/redirections';
import { url, getImageOgFullPath } from '~/utils/url';

const trackToColor: Record<MemberTrack, TeamSectionMember['color']> = {
  architecte: 'yellow',
  builder: 'mint',
  'expert-engineer': 'sky',
};

export const loader = createHybridLoader(async (args: LoaderFunctionArgs) => {
  await redirectWithLocale(args);
  const lang = getLang(args.params);
  const t = await i18nServer.getFixedT(lang, 'about');

  const registry = await loadMemberRegistry();
  const members: TeamSectionMember[] = getFeaturedAboutMembers(registry).map(
    (m) => ({
      slug: m.slug,
      name: m.name,
      role: m.role,
      bio: m.bio[lang],
      imageSrc: m.avatar,
      linkedInUrl: m.linkedin,
      color: trackToColor[m.track],
    }),
  );

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    ogImageSrc: getImageOgFullPath('strategy', args.request.url),
    showStudio: isPageEnabled('studio'),
    members,
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
  const { showStudio, members } = useLoaderData<typeof loader>();

  return (
    <div>
      <HeroSection />
      <ManifestoSection />
      <TeamSection showStudio={showStudio} members={members} />
      <ValuesSection />
      <ReassuranceSection />
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
