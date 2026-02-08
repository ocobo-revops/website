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
import { ASSETS_BASE_URL } from '~/config/assets';
import i18nServer from '~/localization/i18n.server';
import { createHybridLoader } from '~/modules/cache';
import { fetchStories } from '~/modules/content';
import { isPageEnabled } from '~/modules/feature-flags';
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
  const t = await i18nServer.getFixedT(lang, 'home');

  let [status, _state, storiesData] = await fetchStories(lang);

  // Stories only exist in French — fall back to French quotes for other languages
  if (status !== 200 && lang !== 'fr') {
    [status, _state, storiesData] = await fetchStories('fr');
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
  const { showStudio, showTechnology, testimonials } =
    useLoaderData<typeof loader>();
  const { t } = useTranslation('home');

  return (
    <div>
      <HeroSection />
      <SocialProofSection testimonials={testimonials} />
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
