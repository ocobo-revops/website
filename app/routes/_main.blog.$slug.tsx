import { type LoaderFunctionArgs, MetaFunction } from 'react-router';
import { useLoaderData } from 'react-router';

import { css } from '@ocobo/styled-system/css';

import { BlogArticle } from '~/components/blog';
import { Container } from '~/components/ui/Container';
import { ScrollProgressBar } from '~/components/ui/ScrollProgressBar';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';

export const handle = {
  scripts: () => [{ src: 'https://player.ausha.co/ausha-player.js' }],
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { slug } = params;

  if (!slug) {
    throw new Response('Not Found', { status: 404 });
  }

  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || 'fr';

  // Build API URL with same origin (internal call)
  const apiUrl = new URL(`/api/posts/${slug}`, url.origin);
  if (lang !== 'fr') apiUrl.searchParams.set('lang', lang);

  try {
    // Call internal API route (optimized on Vercel)
    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      if (response.status === 404) {
        throw new Response('Not Found', { status: 404 });
      }
      throw new Response('Internal Server Error', { status: 500 });
    }

    const { data: article, isError } = await response.json();

    if (isError || !article) {
      throw new Response('Not Found', { status: 404 });
    }

    return { article };
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error('Failed to fetch from API:', error);
    throw new Response('Internal Server Error', { status: 500 });
  }
}

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  return getMetaTags({
    title: data?.article.frontmatter.title,
    description: data?.article.frontmatter.description,
    image: data?.article.frontmatter.image,
    locale: getLang(params),
  });
};

export default function Index() {
  const { article } = useLoaderData<typeof loader>();

  return (
    <div
      className={css({
        position: 'relative',
      })}
    >
      <ScrollProgressBar variant="sky" />
      <Container>
        <BlogArticle article={article} />
      </Container>
    </div>
  );
}
