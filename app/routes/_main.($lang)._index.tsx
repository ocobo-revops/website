import * as React from 'react';

import { type LoaderFunctionArgs, type MetaFunction } from 'react-router';
import { Await, useLoaderData } from 'react-router';
import { ClientOnly } from 'remix-utils/client-only';

import { css } from '@ocobo/styled-system/css';

import { ClientCarousel } from '~/components/ClientCarousel';
import {
  Aligned,
  Better,
  Contact,
  Faster,
  Hero,
  Stories,
  Stronger,
  Tools,
} from '~/components/homepage';
import { Loader } from '~/components/ui/Loader';
import i18nServer from '~/localization/i18n.server';
import type { MarkdocFile, StoryFrontmatter } from '~/types';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';
import { redirectWithLocale } from '~/utils/redirections';
import { getImageOgFullPath } from '~/utils/url';

export async function loader(args: LoaderFunctionArgs) {
  await redirectWithLocale(args);
  const t = await i18nServer.getFixedT(getLang(args.params), 'home');

  const url = new URL(args.request.url);
  const lang = getLang(args.params) || 'fr';

  // Build API URL with same origin (internal call)
  const apiUrl = new URL('/api/stories', url.origin);
  if (lang !== 'fr') apiUrl.searchParams.set('lang', lang);

  try {
    // Call internal API route (optimized on Vercel)
    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      console.error(`API call failed: ${response.status}`);
      return {
        title: t('meta.title'),
        description: t('meta.description'),
        stories: [],
        ogImageSrc: getImageOgFullPath('homepage', args.request.url),
      };
    }

    const { data: storiesData, isError } = await response.json();

    if (isError || !storiesData) {
      console.error('API returned error');
      return {
        title: t('meta.title'),
        description: t('meta.description'),
        stories: [],
        ogImageSrc: getImageOgFullPath('homepage', args.request.url),
      };
    }

    // Use Fisher-Yates shuffle algorithm
    const shuffleArray = <T,>(array: T[]): T[] => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    const stories = shuffleArray(
      storiesData as MarkdocFile<StoryFrontmatter>[],
    ).map((item: MarkdocFile<StoryFrontmatter>) => {
      const randomQuoteIndex = Math.floor(
        Math.random() * item.frontmatter.quotes.length,
      );
      return {
        id: item.slug,
        slug: item.slug,
        speaker: item.frontmatter.speaker,
        role: item.frontmatter.role,
        name: item.frontmatter.name,
        quote: item.frontmatter.quotes[randomQuoteIndex],
      };
    });

    return {
      title: t('meta.title'),
      description: t('meta.description'),
      stories,
      ogImageSrc: getImageOgFullPath('homepage', args.request.url),
    };
  } catch (error) {
    console.error('Failed to fetch from API:', error);
    return {
      title: t('meta.title'),
      description: t('meta.description'),
      stories: [],
      ogImageSrc: getImageOgFullPath('homepage', args.request.url),
    };
  }
}

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
  const { stories } = useLoaderData<typeof loader>();

  return (
    <div>
      <Hero />
      <ClientCarousel shouldDisplayTitle />
      <Stories.Section>
        <ClientOnly>
          {() => (
            <React.Suspense
              fallback={
                <Loader
                  className={css({
                    h: 'full',
                    translateY: '50px',
                  })}
                />
              }
            >
              <Await resolve={stories}>
                {(stories) => <Stories.Inner items={stories} />}
              </Await>
            </React.Suspense>
          )}
        </ClientOnly>
      </Stories.Section>
      <Faster />
      <Better />
      <Aligned />
      <Stronger />
      <Tools />
      <Contact />
    </div>
  );
}
