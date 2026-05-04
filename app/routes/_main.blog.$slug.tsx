import { type LoaderFunctionArgs, MetaFunction, data } from 'react-router';
import { useLoaderData } from 'react-router';

import { css } from '@ocobo/styled-system/css';

import { BlogArticle } from '~/components/blog';
import { Container } from '~/components/ui/Container';
import { ScrollProgressBar } from '~/components/ui/ScrollProgressBar';
import { createHybridLoader } from '~/modules/cache';
import {
  fetchBlogpost,
  loadMemberRegistry,
  resolveAuthor,
} from '~/modules/content';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';

export const handle = {
  scripts: () => [{ src: 'https://player.ausha.co/ausha-player.js' }],
};

export const loader = createHybridLoader(
  async ({ params }: LoaderFunctionArgs) => {
    const { slug } = params;

    if (!slug) {
      throw new Response('Not Found', { status: 404 });
    }

    const [status, _state, article] = await fetchBlogpost(slug);

    if (status !== 200 || !article) {
      throw new Response('Not Found', { status: 404 });
    }

    const registry = await loadMemberRegistry();
    const resolvedAuthor = resolveAuthor(article.frontmatter.author, registry);

    return data(
      { article, resolvedAuthor },
      {
        headers: {
          'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
          Vary: 'Accept-Language',
        },
      },
    );
  },
  'blogPost', // Use blog post cache strategy
);

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  return getMetaTags({
    title: data?.article.frontmatter.title,
    description: data?.article.frontmatter.description,
    image: data?.article.frontmatter.image,
    locale: getLang(params),
  });
};

export default function Index() {
  const { article, resolvedAuthor } = useLoaderData<typeof loader>();

  return (
    <div
      className={css({
        position: 'relative',
      })}
    >
      <ScrollProgressBar variant="sky" />
      <Container>
        <BlogArticle article={article} resolvedAuthor={resolvedAuthor} />
      </Container>
    </div>
  );
}
