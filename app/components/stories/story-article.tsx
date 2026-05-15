import { ArrowLeftIcon } from 'lucide-react';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Await, NavLink } from 'react-router';

import { css } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';

import type { Member, Tool } from '~/modules/content';
import type { MarkdocFile, StoryFrontmatter } from '~/types';
import { url } from '~/utils/url';

import { StoryCtaBlock } from './story-cta-block';
import { StoryDeliverables } from './story-deliverables';
import { StoryHeader } from './story-header';
import { StoryMarkdownContainer } from './story-markdown-container';
import { StoryMetas } from './story-metas';
import { StoryQuoteBlock } from './story-quote-block';
import { StoryTeamBlock } from './story-team-block';

import { LayoutPost } from '../LayoutPost';
import { PlayerYoutube } from '../PlayerYoutube';

interface StoryArticleProps {
  article: MarkdocFile<StoryFrontmatter>;
  resolvedTools?: Tool[];
  resolvedTeam: Promise<Member[]>;
}

const StoryArticle: React.FunctionComponent<StoryArticleProps> = ({
  article,
  resolvedTools = [],
  resolvedTeam,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className={css({ mb: '12' })}>
        <NavLink
          to={url.stories}
          className={`${flex({ gap: '2', align: 'center' })} ${css({
            display: 'inline-flex',
            color: 'gray.400',
            fontWeight: 'black',
            textTransform: 'uppercase',
            letterSpacing: 'widest',
            fontSize: 'xs',
            transition: 'colors',
            _hover: { color: 'ocobo.dark' },
          })}`}
        >
          <ArrowLeftIcon size={14} className={css({ mr: '2' })} />
          {t('clients.back')}
        </NavLink>
      </div>

      <StoryHeader item={article.frontmatter} slug={article.slug} />

      <LayoutPost.Root>
        <LayoutPost.Aside hideCta>
          <StoryMetas
            item={article.frontmatter}
            resolvedTools={resolvedTools}
            className={css({
              hideBelow: 'lg',
            })}
          />
          <StoryDeliverables items={article.frontmatter.deliverables} />
        </LayoutPost.Aside>

        <LayoutPost.Main>
          <StoryMarkdownContainer content={article.content} />
          {article.frontmatter.youtubeId && (
            <PlayerYoutube
              id={article.frontmatter.youtubeId}
              className={css({ mt: 8 })}
            />
          )}
          <StoryQuoteBlock item={article.frontmatter} slug={article.slug} />
          <Suspense fallback={null}>
            <Await resolve={resolvedTeam}>
              {(team) => <StoryTeamBlock members={team} />}
            </Await>
          </Suspense>
        </LayoutPost.Main>
      </LayoutPost.Root>

      <StoryCtaBlock />
    </div>
  );
};

StoryArticle.displayName = 'StoryArticle';

export { StoryArticle };
