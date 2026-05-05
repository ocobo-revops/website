import { ArrowLeftIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';

import type { Member, Tool } from '~/modules/content';
import type { MarkdocFile, StoryFrontmatter } from '~/types';
import { url } from '~/utils/url';

import { StoryDeliverables } from './story-deliverables';
import { StoryHeader } from './story-header';
import { StoryMarkdownContainer } from './story-markdown-container';
import { StoryMetas } from './story-metas';
import { StoryQuoteBlock } from './story-quote-block';

import { LayoutPost } from '../LayoutPost';
import { PlayerYoutube } from '../PlayerYoutube';

interface StoryArticleProps {
  article: MarkdocFile<StoryFrontmatter>;
  resolvedTools?: Tool[];
  resolvedTeam?: Member[];
}

const StoryArticle: React.FunctionComponent<StoryArticleProps> = ({
  article,
  resolvedTools = [],
  resolvedTeam = [],
}) => {
  const { t } = useTranslation();
  return (
    <LayoutPost.Root>
      <LayoutPost.Aside>
        <StoryMetas
          item={article.frontmatter}
          slug={article.slug}
          resolvedTools={resolvedTools}
          resolvedTeam={resolvedTeam}
          className={css({
            hideBelow: 'lg',
          })}
        />
        <StoryDeliverables items={article.frontmatter.deliverables} />
      </LayoutPost.Aside>

      <LayoutPost.Main>
        <p className={css({ mb: '8', fontSize: 'sm', color: 'gray.500' })}>
          <NavLink
            to={url.stories}
            className={flex({
              align: 'center',
              gap: '2',
              display: 'inline-flex',
            })}
          >
            <ArrowLeftIcon className={css({ h: '4', w: '4' })} />
            <span
              className={css({
                fontWeight: 'black',
                textTransform: 'uppercase',
                letterSpacing: 'widest',
                fontSize: 'xs',
              })}
            >
              {t('clients.back')}
            </span>
          </NavLink>
        </p>
        <StoryHeader item={article.frontmatter} slug={article.slug} />
        <StoryMarkdownContainer content={article.content} />
        {article.frontmatter.youtubeId && (
          <PlayerYoutube
            id={article.frontmatter.youtubeId}
            className={css({ mt: 8 })}
          />
        )}
        <StoryQuoteBlock item={article.frontmatter} slug={article.slug} />
      </LayoutPost.Main>
    </LayoutPost.Root>
  );
};

StoryArticle.displayName = 'StoryArticle';

export { StoryArticle };
