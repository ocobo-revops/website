import { CalendarDaysIcon, ClockIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';
import { badge, text } from '@ocobo/styled-system/recipes';

import { OptimizedImage } from '~/components/ui/optimized-image';
import type { BlogpostFrontmatter } from '~/types';
import { getTag } from '~/utils/labels';

import { FrenchText } from '../typography/french-text';

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
  const locale = i18n.resolvedLanguage ?? i18n.language ?? 'fr';
  const firstTag = item.tags[0];

  return (
    <header
      className={css({
        textAlign: 'center',
        mb: '16',
        maxW: '4xl',
        mx: 'auto',
      })}
    >
      {firstTag && (
        <div className={css({ mb: '8' })}>
          <span className={badge({ variant: 'coral' })}>
            {getTag(firstTag)}
          </span>
        </div>
      )}

      <h1
        className={cx(
          text({ variant: 'display-xl', color: 'dark' }),
          css({
            fontSize: { base: '3xl', md: '4xl', lg: '6xl' },
            fontWeight: 'black',
            letterSpacing: 'tight',
            lineHeight: '1.05',
            mb: '10',
          }),
        )}
      >
        <FrenchText>{item.title}</FrenchText>
      </h1>

      <div
        className={cx(
          flex({ gap: 8, justify: 'center', align: 'center', wrap: 'wrap' }),
          css({
            fontSize: 'xs',
            fontWeight: 'bold',
            color: 'gray.400',
            textTransform: 'uppercase',
            letterSpacing: 'widest',
            mb: '10',
          }),
        )}
      >
        <span className={flex({ gap: '2', align: 'center' })}>
          <CalendarDaysIcon
            size={14}
            aria-hidden="true"
            className={css({ color: 'ocobo.yellow' })}
          />
          {formatDate(item.date, locale)}
        </span>
        <span className={flex({ gap: '2', align: 'center' })}>
          <ClockIcon
            size={14}
            aria-hidden="true"
            className={css({ color: 'ocobo.sky' })}
          />
          {item.read}
        </span>
      </div>

      <OptimizedImage
        src={item.image}
        alt=""
        width={1200}
        height={630}
        priority
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
