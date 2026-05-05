import { type LoaderFunctionArgs, MetaFunction, data } from 'react-router';
import { useLoaderData } from 'react-router';

import { css } from '@ocobo/styled-system/css';

import { StoryArticle } from '~/components/stories';
import { Container } from '~/components/ui/Container';
import { ScrollProgressBar } from '~/components/ui/ScrollProgressBar';
import { createHybridLoader } from '~/modules/cache';
import {
  fetchStory,
  loadMemberRegistry,
  loadToolRegistry,
  resolveTeam,
  resolveTool,
} from '~/modules/content';
import { getLang } from '~/utils/lang';
import { getMetaTags } from '~/utils/metatags';

export const loader = createHybridLoader(
  async ({ params }: LoaderFunctionArgs) => {
    const { slug } = params;

    if (!slug) {
      throw new Response('Not Found', { status: 404 });
    }

    const [[status, _state, article], toolRegistry, memberRegistry] =
      await Promise.all([
        fetchStory(slug),
        loadToolRegistry(),
        loadMemberRegistry(),
      ]);

    if (status !== 200 || !article) {
      throw new Response('Not Found', { status: 404 });
    }

    const resolvedTools = article.frontmatter.tools
      .map((toolSlug) => resolveTool(toolSlug, toolRegistry))
      .filter((t): t is NonNullable<typeof t> => t !== null);

    const resolvedTeam = resolveTeam(
      article.frontmatter.team ?? [],
      memberRegistry,
    );

    return data(
      { article, resolvedTools, resolvedTeam },
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
  const { article, resolvedTools, resolvedTeam } =
    useLoaderData<typeof loader>();

  return (
    <div
      className={css({
        position: 'relative',
      })}
    >
      <ScrollProgressBar variant="mint" />
      <Container>
        <StoryArticle
          article={article}
          resolvedTools={resolvedTools}
          resolvedTeam={resolvedTeam}
        />
      </Container>
    </div>
  );
}
