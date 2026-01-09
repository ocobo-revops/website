import * as React from 'react';

import { type LoaderFunctionArgs, MetaFunction } from 'react-router';
import { Await, useLoaderData } from 'react-router';

import { css } from '@ocobo/styled-system/css';

import { BlogList } from '~/components/blog';
import { Container } from '~/components/ui/Container';
import { Loader } from '~/components/ui/Loader';
import { getMetaTags } from '~/utils/metatags';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  // Extract existing parameters
  const tag = url.searchParams.get('tag');
  const lang = url.searchParams.get('lang') || 'fr';

  // Build API URL with same origin (internal call)
  const apiUrl = new URL('/api/posts', url.origin);
  if (tag) apiUrl.searchParams.set('tag', tag);
  if (lang !== 'fr') apiUrl.searchParams.set('lang', lang);

  try {
    // Call internal API route (optimized on Vercel)
    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      console.error(`API call failed: ${response.status}`);
      return { posts: [], isError: true };
    }

    const { data, isError } = await response.json();

    if (isError) {
      console.error('API returned error');
      return { posts: [], isError: true };
    }

    return { posts: data || [], isError: false };
  } catch (error) {
    console.error('Failed to fetch from API:', error);
    return { posts: [], isError: true };
  }
}

// Headers now handled by entry.server.tsx - framework-native cache control!

export const meta: MetaFunction<typeof loader> = () => {
  return getMetaTags({
    title: 'Le blog des Revenue Operations',
    description:
      "Le blog d'Ocobo éclaire les leaders Revenue et les équipes RevOps avec des ressources sur les tendances et les meilleures pratiques du marché.",
  });
};

export default function Index() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div>
      <Container>
        <React.Suspense fallback={<Loader className={css({ h: '75vh' })} />}>
          <Await resolve={posts}>{(posts) => <BlogList items={posts} />}</Await>
        </React.Suspense>
      </Container>
    </div>
  );
}
