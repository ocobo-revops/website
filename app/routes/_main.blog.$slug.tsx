import { type LoaderFunctionArgs, MetaFunction, data } from 'react-router';
import { useLoaderData } from 'react-router';

import Markdoc from '@markdoc/markdoc';
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
import { extractToc } from '~/modules/content/toc';
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

    const [[status, _state, article], registry] = await Promise.all([
      fetchBlogpost(slug),
      loadMemberRegistry(),
    ]);

    if (status !== 200 || !article) {
      throw new Response('Not Found', { status: 404 });
    }

    const resolvedAuthor = resolveAuthor(article.frontmatter.author, registry);
    const toc = extractToc(Markdoc.parse(article.markdown));

    return data(
      { article, resolvedAuthor, toc },
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
  const { article, resolvedAuthor, toc } = useLoaderData<typeof loader>();

  return (
    <div
      className={css({
        position: 'relative',
      })}
    >
      <ScrollProgressBar variant="sky" />
      <Container>
        <BlogArticle
          article={article}
          resolvedAuthor={resolvedAuthor}
          toc={toc}
        />
      </Container>
    </div>
  );
}
