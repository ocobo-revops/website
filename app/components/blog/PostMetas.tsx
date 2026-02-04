import { CalendarDaysIcon, CoffeeIcon, TagsIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { circle, flex } from '@ocobo/styled-system/patterns';
import { icon } from '@ocobo/styled-system/recipes';

import { ASSETS_BASE_URL } from '~/config/assets';
import { BlogpostFrontmatter } from '~/types';
import { getAuthor, getTag } from '~/utils/labels';

import { AsideCard } from '../AsideCard';
import { Avatar } from '../ui/Avatar';

const formatDate = (date: string, locale: string) => {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
};

interface BlogpostMetasProps
  extends React.ComponentProps<typeof AsideCard.Root> {
  item: BlogpostFrontmatter;
}

const PostMetas: React.FunctionComponent<BlogpostMetasProps> = ({
  item,
  ...props
}) => {
  const { i18n } = useTranslation();

  return (
    <AsideCard.Root variant="post" {...props}>
      <AsideCard.Section>
        <div
          className={flex({ gap: 3, fontWeight: 'bold', alignItems: 'center' })}
        >
          <Avatar
            src={`${ASSETS_BASE_URL}/team/${item.author}.jpeg`}
            alt={item.author}
            className={circle({ size: '32px' })}
          />
          {getAuthor(item.author)}
        </div>
      </AsideCard.Section>
      <AsideCard.Section>
        <div className={flex({ gap: 3, alignItems: 'center' })}>
          <CalendarDaysIcon className={icon({ size: 'lg' })} />
          {formatDate(item.date, i18n.language || 'fr')}
        </div>
      </AsideCard.Section>
      <AsideCard.Section>
        <div className={flex({ gap: 3, alignItems: 'center' })}>
          <CoffeeIcon className={icon({ size: 'lg' })} />
          {item.read}
        </div>
      </AsideCard.Section>
      <AsideCard.Section>
        <div className={flex({ gap: 3 })}>
          <TagsIcon className={icon({ size: 'lg' })} />
          <ul>
            {item.tags.map((item) => {
              return (
                <li key={item} className={css({})}>
                  {getTag(item)}
                </li>
              );
            })}
          </ul>
        </div>
      </AsideCard.Section>
    </AsideCard.Root>
  );
};

PostMetas.displayName = 'PostMetas';

export { PostMetas };
