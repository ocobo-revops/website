import * as React from 'react';

import { type LoaderFunctionArgs, MetaFunction } from 'react-router';
import { Await, useLoaderData } from 'react-router';

import { css } from '@ocobo/styled-system/css';

import { BlogHero } from '~/components/blog/blog-hero';
import { BlogList } from '~/components/blog/blog-list';
import { Container } from '~/components/ui/Container';
import { Loader } from '~/components/ui/Loader';
import { createHybridLoader } from '~/modules/cache';
import {
  fetchBlogposts,
  loadMemberRegistry,
  resolveAuthor,
} from '~/modules/content';
import { getMetaTags } from '~/utils/metatags';

export const loader = createHybridLoader(async (_args: LoaderFunctionArgs) => {
  const [[status, state, blogData], registry] = await Promise.all([
    fetchBlogposts(),
    loadMemberRegistry(),
  ]);

  if (status !== 200 || !blogData) {
    console.error(`Failed to fetch blog posts: ${state}`);
    return { posts: [], isError: true };
  }

  const posts = blogData
    .map((entry) => ({
      ...entry,
      resolvedAuthor: resolveAuthor(entry.frontmatter.author, registry),
      _sortDate: new Date(entry.frontmatter.date).getTime(),
    }))
    .sort((a, b) => b._sortDate - a._sortDate)
    .map(({ _sortDate, ...entry }) => entry);

  return { posts, isError: false };
}, 'blogPost');

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
      <BlogHero />
      <Container>
        <React.Suspense fallback={<Loader className={css({ h: '75vh' })} />}>
          <Await resolve={posts}>{(posts) => <BlogList items={posts} />}</Await>
        </React.Suspense>
      </Container>
    </div>
  );
}
