import { type LoaderFunctionArgs, MetaFunction, data } from 'react-router';
import { useLoaderData } from 'react-router';

import { css } from '@ocobo/styled-system/css';

import { StoryArticle } from '~/components/stories';
import { Container } from '~/components/ui/Container';
import { ScrollProgressBar } from '~/components/ui/ScrollProgressBar';
import { createHybridLoader } from '~/modules/cache';
import { fetchStory } from '~/modules/content';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';

export const loader = createHybridLoader(
  async ({ params }: LoaderFunctionArgs) => {
    const { slug } = params;

    if (!slug) {
      throw new Response('Not Found', { status: 404 });
    }

    const [status, _state, article] = await fetchStory(slug);

    if (status !== 200 || !article) {
      throw new Response('Not Found', { status: 404 });
    }

    return data(
      { article },
      {
        headers: {
          'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
          Vary: 'Accept-Language',
        },
      },
    );
  },
  'story', // Use story cache strategy
);

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  return getMetaTags({
    title: data?.article.frontmatter.title,
    description: data?.article.frontmatter.subtitle,
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
      <ScrollProgressBar variant="mint" />
      <Container>
        <StoryArticle article={article} />
      </Container>
    </div>
  );
}
