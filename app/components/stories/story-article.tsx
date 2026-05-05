import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';

import type { Tool } from '~/modules/content';
import type { MarkdocFile, StoryFrontmatter } from '~/types';

import { StoryDeliverables } from './story-deliverables';
import { StoryHeader } from './story-header';
import { StoryMarkdownContainer } from './story-markdown-container';
import { StoryMetas } from './story-metas';

import { LayoutPost } from '../LayoutPost';
import { PlayerYoutube } from '../PlayerYoutube';
import { Breadcrumb } from '../ui/Breadcrumb';

interface StoryArticleProps {
  article: MarkdocFile<StoryFrontmatter>;
  resolvedTools?: Tool[];
}

const StoryArticle: React.FunctionComponent<StoryArticleProps> = ({
  article,
  resolvedTools = [],
}) => {
  const { t } = useTranslation();
  return (
    <LayoutPost.Root>
      <LayoutPost.Aside>
        <StoryMetas
          item={article.frontmatter}
          slug={article.slug}
          resolvedTools={resolvedTools}
          className={css({
            hideBelow: 'lg',
          })}
        />
        <StoryDeliverables items={article.frontmatter.deliverables} />
      </LayoutPost.Aside>

      <LayoutPost.Main>
        <Breadcrumb>
          {t('navigation.stories')} / {article.frontmatter.name}
        </Breadcrumb>
        <StoryHeader item={article.frontmatter} slug={article.slug} />
        <StoryMarkdownContainer content={article.content} />
        {article.frontmatter.youtubeId && (
          <PlayerYoutube
            id={article.frontmatter.youtubeId}
            className={css({ mt: 8 })}
          />
        )}
      </LayoutPost.Main>
    </LayoutPost.Root>
  );
};

StoryArticle.displayName = 'StoryArticle';

export { StoryArticle };
