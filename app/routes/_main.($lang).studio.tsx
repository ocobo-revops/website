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
import type { MemberTrack } from '~/modules/schemas';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';
import { redirectWithLocale } from '~/utils/redirections';
import { url, getImageOgFullPath } from '~/utils/url';

export type StudioMember = {
  slug: string;
  name: string;
  track: MemberTrack;
  role: string;
  bio: string;
  avatar: string;
  linkedin?: string;
};

export const loader = createHybridLoader(async (args: LoaderFunctionArgs) => {
  await redirectWithLocale(args);
  throwIfDisabled('studio');
  const lang = getLang(args.params);
  const t = await i18nServer.getFixedT(lang, 'studio');

  const registry = await loadMemberRegistry();
  const members: StudioMember[] = getActiveMembers(registry).map((m) => ({
    slug: m.slug,
    name: m.name,
    track: m.track,
    role: m.role[lang],
    bio: m.bio[lang],
    avatar: m.avatar,
    linkedin: m.linkedin,
  }));

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    ogImageSrc: getImageOgFullPath('studio', args.request.url),
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

export default function StudioPage() {
  const { t } = useTranslation('studio');
  const { members } = useLoaderData<typeof loader>();

  return (
    <div>
      <HeroSection />
      <ModelSection />
      <TeamSection members={members} />
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
