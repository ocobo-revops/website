import { CalendarDaysIcon, CoffeeIcon, Linkedin, TagsIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { circle, flex } from '@ocobo/styled-system/patterns';
import { card } from '@ocobo/styled-system/recipes';

import type { ResolvedAuthor } from '~/modules/content/members';
import { type BlogpostFrontmatter } from '~/types';
import { getTag } from '~/utils/labels';

import { Avatar } from '../ui/Avatar';

const formatDate = (date: string, locale: string) => {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
};

interface BlogpostMetasProps {
  item: BlogpostFrontmatter;
  resolvedAuthor: ResolvedAuthor;
  className?: string;
}

const sectionCss = css({
  bg: 'sky.light',
  borderColor: 'sky',
  borderBottom: 'thin',
  p: 6,
  _last: {
    borderBottom: 'none',
  },
});

const iconCss = css({ h: '6', w: '6' });

const PostMetas: React.FunctionComponent<BlogpostMetasProps> = ({
  item,
  resolvedAuthor,
  className,
}) => {
  const { i18n } = useTranslation();

  return (
    <div
      className={cx(
        card({ padding: 'sm' }),
        css({ mb: 8, p: '0', overflow: 'hidden' }),
        className,
      )}
    >
      <div className={sectionCss}>
        <div
          className={flex({ gap: 3, fontWeight: 'bold', alignItems: 'center' })}
        >
          {resolvedAuthor.avatar && (
            <Avatar
              src={resolvedAuthor.avatar}
              alt=""
              className={circle({ size: '32px' })}
            />
          )}
          <span>{resolvedAuthor.name}</span>
          {resolvedAuthor.linkedin && (
            <a
              href={resolvedAuthor.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${resolvedAuthor.name} LinkedIn`}
              className={css({
                color: 'gray.400',
                _hover: { color: 'ocobo.dark' },
              })}
            >
              <Linkedin size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
      <div className={sectionCss}>
        <div className={flex({ gap: 3, alignItems: 'center' })}>
          <CalendarDaysIcon className={iconCss} />
          {formatDate(item.date, i18n.language || 'fr')}
        </div>
      </div>
      <div className={sectionCss}>
        <div className={flex({ gap: 3, alignItems: 'center' })}>
          <CoffeeIcon className={iconCss} />
          {item.read}
        </div>
      </div>
      <div className={sectionCss}>
        <div className={flex({ gap: 3 })}>
          <TagsIcon className={iconCss} />
          <ul>
            {item.tags.map((tag) => {
              return (
                <li key={tag} className={css({})}>
                  {getTag(tag)}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

PostMetas.displayName = 'PostMetas';

export { PostMetas };
