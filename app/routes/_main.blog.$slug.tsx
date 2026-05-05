import { type LoaderFunctionArgs, MetaFunction, data } from 'react-router';
import { useLoaderData } from 'react-router';

import Markdoc from '@markdoc/markdoc';
import { BlogArticle } from '~/components/blog/blog-article';
import { Container } from '~/components/ui/Container';
import { createHybridLoader } from '~/modules/cache';
import { fetchBlogpost } from '~/modules/content';
import { extractFirstParagraph, extractToc } from '~/modules/content/toc';
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

    const [status, _state, article] = await fetchBlogpost(
      slug,
      getLang(params),
    );

    if (status !== 200 || !article) {
      throw new Response('Not Found', { status: 404 });
    }

    const ast = Markdoc.parse(article.markdown);
    const toc = extractToc(ast);
    const intro =
      article.frontmatter.exerpt ?? extractFirstParagraph(ast) ?? null;

    return data(
      { article, toc, intro },
      {
        headers: {
          'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
          Vary: 'Accept-Language',
        },
      },
    );
  },
  'blogPost',
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
  const { article, toc, intro } = useLoaderData<typeof loader>();

  return (
    <div>
      <Container>
        <BlogArticle article={article} toc={toc} intro={intro} />
      </Container>
    </div>
  );
}
