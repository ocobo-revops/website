import * as React from 'react';

import { type LoaderFunctionArgs, MetaFunction } from 'react-router';
import { Await, useLoaderData } from 'react-router';

import { css } from '@ocobo/styled-system/css';

import { ClientCarousel } from '~/components/ClientCarousel';
import { Hero, StoryList } from '~/components/stories';
import { Container } from '~/components/ui/Container';
import { Loader } from '~/components/ui/Loader';
import { getMetaTags } from '~/utils/metatags';
import { getImageOgFullPath } from '~/utils/url';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  // Extract existing parameters
  const tag = url.searchParams.get('tag');
  const lang = url.searchParams.get('lang') || 'fr';

  // Build API URL with same origin (internal call)
  const apiUrl = new URL('/api/stories', url.origin);
  if (tag) apiUrl.searchParams.set('tag', tag);
  if (lang !== 'fr') apiUrl.searchParams.set('lang', lang);

  try {
    // Call internal API route (optimized on Vercel)
    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      console.error(`API call failed: ${response.status}`);
      return {
        stories: [],
        isError: true,
        ogImageSrc: getImageOgFullPath('clients', request.url),
      };
    }

    const { data, isError } = await response.json();

    if (isError) {
      console.error('API returned error');
      return {
        stories: [],
        isError: true,
        ogImageSrc: getImageOgFullPath('clients', request.url),
      };
    }

    return {
      stories: data || [],
      isError: false,
      ogImageSrc: getImageOgFullPath('clients', request.url),
    };
  } catch (error) {
    console.error('Failed to fetch from API:', error);
    return {
      stories: [],
      isError: true,
      ogImageSrc: getImageOgFullPath('clients', request.url),
    };
  }
}

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
