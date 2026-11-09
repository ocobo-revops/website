import { useTranslation } from 'react-i18next';
import { type LoaderFunctionArgs, type MetaFunction } from 'react-router';
import { useLoaderData } from 'react-router';

import { AiSection } from '~/components/home/ai-section';
import {
  ChallengesSection,
  DIAGNOSTIC_ID,
} from '~/components/home/challenges-section';
import { ComparatifSection } from '~/components/home/comparatif-section';
import { CtaSection } from '~/components/home/cta-section';
import { HomeHero } from '~/components/home/home-hero';
import { InterventionsSection } from '~/components/home/interventions-section';
import { MissionSection } from '~/components/home/mission-section';
import { SocialProofSection } from '~/components/home/social-proof-section';
import { StackSection } from '~/components/home/stack-section';
import { ASSETS_BASE_URL } from '~/config/assets';
import i18nServer from '~/localization/i18n.server';
import { createHybridLoader } from '~/modules/cache';
import { fetchStories } from '~/modules/content';
import { isPageEnabled } from '~/modules/feature-flags';
import { loadHomeChallenges } from '~/modules/home-challenges.server';
import type { MarkdocFile, StoryFrontmatter } from '~/types';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';
import { redirectWithLocale } from '~/utils/redirections';
import { url, getImageOgFullPath } from '~/utils/url';

export interface Testimonial {
  slug: string;
  name: string;
  speaker: string;
  role: string;
  quote: string;
  logo: string;
  avatar: string;
}

function shuffleArray<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const loader = createHybridLoader(async (args: LoaderFunctionArgs) => {
  await redirectWithLocale(args);
  const lang = getLang(args.params);
  // All independent: i18n, both story fetches and the challenge cards (#241)
  // start in parallel.
  const [t, [primary, fallback], challenges] = await Promise.all([
    i18nServer.getFixedT(lang, 'home'),
    Promise.all([
      fetchStories(lang),
      lang === 'fr' ? Promise.resolve(null) : fetchStories('fr'),
    ]),
    loadHomeChallenges(lang),
  ]);

  let [status, _state, storiesData] = primary;
  if (status !== 200 && fallback) {
    [status, _state, storiesData] = fallback;
  }

  let testimonials: Testimonial[] = [];

  if (status === 200 && storiesData) {
    const entries = storiesData as MarkdocFile<StoryFrontmatter>[];
    const shuffled = shuffleArray(entries);

    testimonials = shuffled
      .filter((entry) => entry.frontmatter.quotes.length > 0)
      .map((entry) => {
        const randomQuoteIndex = Math.floor(
          Math.random() * entry.frontmatter.quotes.length,
        );
        return {
          slug: entry.slug,
          name: entry.frontmatter.name,
          speaker: entry.frontmatter.speaker,
          role: entry.frontmatter.role,
          quote: entry.frontmatter.quotes[randomQuoteIndex],
          logo: `${ASSETS_BASE_URL}/clients/${entry.slug}-white.png`,
          avatar: `${ASSETS_BASE_URL}/clients/${entry.slug}-avatar.png`,
        };
      });
  }

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    ogImageSrc: getImageOgFullPath('homepage', args.request.url),
    showStudio: isPageEnabled('studio'),
    showTechnology: isPageEnabled('technology'),
    testimonials,
    challenges,
  };
}, 'story');

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
  const { showStudio, showTechnology, testimonials, challenges } =
    useLoaderData<typeof loader>();
  const { t } = useTranslation('home');
  const hasChallenges = challenges.length > 0;
  const aiChallengeSlug =
    challenges.find((challenge) => challenge.key === 'ai')?.slug ?? null;

  // The mockup order (`accueil.html`): hero, clients, mission, AI,
  // challenges, method, why Ocobo, stack, diagnostic.
  return (
    <div>
      <HomeHero hasChallenges={hasChallenges} />
      <SocialProofSection testimonials={testimonials} />
      <MissionSection />
      <AiSection aiChallengeSlug={aiChallengeSlug} />
      {hasChallenges ? <ChallengesSection challenges={challenges} /> : null}
      <InterventionsSection />
      <ComparatifSection showStudio={showStudio} />
      <StackSection showTechnology={showTechnology} />
      <CtaSection
        id={DIAGNOSTIC_ID}
        variant="yellow"
        title={t('cta.title')}
        subtitle={t('cta.subtitle')}
        ctaText={t('cta.button')}
        ctaLink={url.contact}
      />
    </div>
  );
}
