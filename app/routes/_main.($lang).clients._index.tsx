import * as React from 'react';

import { type LoaderFunctionArgs, MetaFunction } from 'react-router';
import { Await, useLoaderData } from 'react-router';

import { css } from '@ocobo/styled-system/css';

import { ClientCarousel } from '~/components/ClientCarousel';
import { Hero, StoryList } from '~/components/stories';
import { Container } from '~/components/ui/Container';
import { Loader } from '~/components/ui/Loader';
import { createHybridLoader } from '~/modules/cache';
import { fetchStories } from '~/modules/content';
import type { MarkdocFile, StoryFrontmatter } from '~/types';
import { getMetaTags } from '~/utils/metatags';
import { getImageOgFullPath } from '~/utils/url';

export const loader = createHybridLoader(
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const tag = url.searchParams.get('tag');

    const [status, state, storiesData] = await fetchStories();

    // Handle errors gracefully
    if (status !== 200 || !storiesData) {
      console.error(`Failed to fetch stories: ${state}`);
      return {
        stories: [],
        isError: true,
        ogImageSrc: getImageOgFullPath('clients', request.url),
      };
    }

    const entries = storiesData as MarkdocFile<StoryFrontmatter>[];

    // Filter and sort stories
    const filteredEntries = tag
      ? entries.filter((entry) => entry.frontmatter.tags.includes(tag))
      : entries;

    const stories = filteredEntries
      .map((entry) => ({
        ...entry,
        _sortDate: new Date(entry.frontmatter.date).getTime(),
      }))
      .sort((a, b) => b._sortDate - a._sortDate)
      .map(({ _sortDate, ...entry }) => entry);

    return {
      stories,
      isError: false,
      ogImageSrc: getImageOgFullPath('clients', request.url),
    };
  },
  'story', // Use story cache strategy
);

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [];
  }
  return getMetaTags({
    title: 'Témoignages clients',
    description:
      "Découvrez les témoignages, et les retours d'expérience des clients de l'agence.",
    locale: 'fr',
    image: data.ogImageSrc,
  });
};

export default function Index() {
  const { stories } = useLoaderData<typeof loader>();

  return (
    <div>
      <Hero />
      <ClientCarousel />
      <Container>
        <React.Suspense fallback={<Loader className={css({ h: '300px' })} />}>
          <Await resolve={stories}>
            {(stories) => <StoryList items={stories} />}
          </Await>
        </React.Suspense>
      </Container>
    </div>
  );
}
