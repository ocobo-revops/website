import { MessageSquareTextIcon, TimerIcon, WrenchIcon } from 'lucide-react';

import { css } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';
import { card } from '@ocobo/styled-system/recipes';

import { ASSETS_BASE_URL } from '~/config/assets';
import { StoryFrontmatter } from '~/types';

interface StoryMetasProps extends React.HTMLAttributes<HTMLDivElement> {
  item: StoryFrontmatter;
  slug: string;
}

const iconSizeLg = css({ h: '6', w: '6' });

const sectionStyle = css({
  bg: 'mint.light',
  borderColor: 'mint',
  borderBottom: 'thin',
  p: 6,
  _last: {
    borderBottom: 'none',
  },
});

const StoryMetas: React.FunctionComponent<StoryMetasProps> = ({
  item,
  slug,
  className,
  ...props
}) => {
  return (
    <div
      className={`${card({ padding: 'md', radius: 'md', tone: 'white', border: true })} ${css({ mb: 8, padding: '0', overflow: 'hidden' })}${className ? ` ${className}` : ''}`}
      {...props}
    >
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

      <div className={sectionStyle}>
        <ul>
          {item.tags.map((tag) => {
            return (
              <li
                key={tag}
                className={css({
                  fontWeight: 'bold',
                  color: 'ocobo.dark',
                })}
              >
                {tag}
              </li>
            );
          })}
        </ul>
      </div>
      <div className={sectionStyle}>
        <div className={flex({ gap: 3 })}>
          <TimerIcon className={iconSizeLg} />
          {item.duration}
        </div>
      </div>
      <div className={sectionStyle}>
        <div className={flex({ gap: 3 })}>
          <MessageSquareTextIcon className={iconSizeLg} />
          <ul>
            {item.scopes.map((scope) => {
              return (
                <li key={scope} className={css({})}>
                  {scope}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className={sectionStyle}>
        <div className={flex({ gap: 3 })}>
          <WrenchIcon className={iconSizeLg} />
          <ul>
            {item.tools.map((tool) => {
              return (
                <li key={tool} className={css({})}>
                  {tool}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

StoryMetas.displayName = 'StoryMetas';

export { StoryMetas };
