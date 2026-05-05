import { CalendarDaysIcon, CoffeeIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';
import { badge, text } from '@ocobo/styled-system/recipes';

import type { BlogpostFrontmatter } from '~/types';
import { getTag } from '~/utils/labels';

const formatDate = (date: string, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));

interface BlogpostHeaderProps {
  item: BlogpostFrontmatter;
}

const PostHeader: React.FunctionComponent<BlogpostHeaderProps> = ({ item }) => {
  const { i18n } = useTranslation();

  return (
    <header className={css({ textAlign: 'center', mb: '10' })}>
      {item.tags.length > 0 && (
        <ul
          className={cx(
            flex({ gap: 2, justify: 'center', wrap: 'wrap' }),
            css({ mb: '6' }),
          )}
        >
          {item.tags.map((tag) => (
            <li key={tag}>
              <span className={badge({ variant: 'sky' })}>{getTag(tag)}</span>
            </li>
          ))}
        </ul>
      )}

      <h1
        className={cx(
          text({ variant: 'display-xl', color: 'dark' }),
          css({
            fontSize: { base: '3xl', md: '4xl', lg: '5xl' },
            letterSpacing: 'tight',
            mb: '6',
          }),
        )}
      >
        {item.title}
      </h1>

      <div
        className={cx(
          flex({ gap: 4, justify: 'center', align: 'center', wrap: 'wrap' }),
          css({ color: 'gray.500', fontSize: 'sm', mb: '10' }),
        )}
      >
        <span className={flex({ gap: 1, align: 'center' })}>
          <CalendarDaysIcon size={14} aria-hidden="true" />
          {formatDate(item.date, i18n.language || 'fr')}
        </span>
        <span className={flex({ gap: 1, align: 'center' })}>
          <CoffeeIcon size={14} aria-hidden="true" />
          {item.read}
        </span>
      </div>

      <img
        src={item.image}
        alt=""
        loading="eager"
        decoding="async"
        className={css({
          display: 'block',
          width: '100%',
          height: 'auto',
          objectFit: 'cover',
          borderRadius: '2xl',
          aspectRatio: '16/7',
        })}
      />
    </header>
  );
};

PostHeader.displayName = 'PostHeader';

export { PostHeader };
