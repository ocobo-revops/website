import { MessageSquareTextIcon, TimerIcon, WrenchIcon } from 'lucide-react';

import { css } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';
import { icon } from '@ocobo/styled-system/recipes';

import { ASSETS_BASE_URL } from '~/config/assets';
import { StoryFrontmatter } from '~/types';

import { AsideCard } from '../AsideCard';

interface StoryMetasProps extends React.ComponentProps<typeof AsideCard.Root> {
  item: StoryFrontmatter;
  slug: string;
}

const StoryMetas: React.FunctionComponent<StoryMetasProps> = ({
  item,
  slug,
  ...props
}) => {
  return (
    <AsideCard.Root {...props}>
      <img
        src={`${ASSETS_BASE_URL}/clients/${slug}-white.png`}
        alt={item.name}
        className={css({
          bg: 'mint.dark',
          p: 4,
          width: '100%',
          height: 'auto',
        })}
      />

      <AsideCard.Section>
        <ul>
          {item.tags.map((item) => {
            return (
              <li
                key={item}
                className={css({
                  fontWeight: 'bold',
                  color: 'ocobo.dark',
                })}
              >
                {item}
              </li>
            );
          })}
        </ul>
      </AsideCard.Section>
      <AsideCard.Section>
        <div className={flex({ gap: 3 })}>
          <TimerIcon className={icon({ size: 'lg' })} />
          {item.duration}
        </div>
      </AsideCard.Section>
      <AsideCard.Section>
        <div className={flex({ gap: 3 })}>
          <MessageSquareTextIcon className={icon({ size: 'lg' })} />
          <ul>
            {item.scopes.map((item) => {
              return (
                <li key={item} className={css({})}>
                  {item}
                </li>
              );
            })}
          </ul>
        </div>
      </AsideCard.Section>
      <AsideCard.Section>
        <div className={flex({ gap: 3 })}>
          <WrenchIcon className={icon({ size: 'lg' })} />
          <ul>
            {item.tools.map((item) => {
              return (
                <li key={item} className={css({})}>
                  {item}
                </li>
              );
            })}
          </ul>
        </div>
      </AsideCard.Section>
    </AsideCard.Root>
  );
};

StoryMetas.displayName = 'StoryMetas';

export { StoryMetas };
