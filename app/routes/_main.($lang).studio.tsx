import {
  type LoaderFunctionArgs,
  type MetaFunction,
  useLoaderData,
} from 'react-router';

import { ClosingSection } from '~/components/studio/closing-section';
import { CompaniesStrip } from '~/components/studio/companies-strip';
import { ExpertisesSection } from '~/components/studio/expertises-section';
import { HeroSection } from '~/components/studio/hero-section';
import { OfficesSection } from '~/components/studio/offices-section';
import { ShareSection } from '~/components/studio/share-section';
import { SquadSection } from '~/components/studio/squad-section';
import { TeamSection } from '~/components/studio/team-section';
import i18nServer from '~/localization/i18n.server';
import { createHybridLoader } from '~/modules/cache';
import { loadMemberRegistry } from '~/modules/content/members';
import { loadToolRegistry } from '~/modules/content/tools';
import { isPageEnabled, throwIfDisabled } from '~/modules/feature-flags';
import { buildStudioTeam } from '~/modules/studio-team';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';
import { redirectWithLocale } from '~/utils/redirections';
import { getImageOgFullPath } from '~/utils/url';

export const loader = createHybridLoader(async (args: LoaderFunctionArgs) => {
  await redirectWithLocale(args);
  throwIfDisabled('studio');
  const lang = getLang(args.params);
  const [t, registry, tools] = await Promise.all([
    i18nServer.getFixedT(lang, 'studio'),
    loadMemberRegistry(),
    loadToolRegistry(),
  ]);
  const { members, previousCompanies } = buildStudioTeam(registry, tools, lang);

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    ogImageSrc: getImageOgFullPath('studio', args.request.url),
    members,
    previousCompanies,
    jobsEnabled: isPageEnabled('jobs'),
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
  const { members, previousCompanies, jobsEnabled } =
    useLoaderData<typeof loader>();

  return (
    <div>
      <HeroSection members={members} />
      <CompaniesStrip companies={previousCompanies} />
      <SquadSection />
      <ExpertisesSection members={members} />
      <TeamSection members={members} />
      <OfficesSection />
      <ShareSection />
      <ClosingSection jobsEnabled={jobsEnabled} />
    </div>
  );
}
