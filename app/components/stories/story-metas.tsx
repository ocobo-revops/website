import {
  MessageSquareTextIcon,
  TimerIcon,
  UsersIcon,
  WrenchIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { circle, flex } from '@ocobo/styled-system/patterns';
import { card } from '@ocobo/styled-system/recipes';

import { ASSETS_BASE_URL } from '~/config/assets';
import type { Member, Tool } from '~/modules/content';
import { StoryFrontmatter } from '~/types';

import { Avatar } from '../ui/Avatar';

interface StoryMetasProps extends React.HTMLAttributes<HTMLDivElement> {
  item: StoryFrontmatter;
  slug: string;
  resolvedTools?: Tool[];
  resolvedTeam?: Member[];
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
  resolvedTools,
  resolvedTeam = [],
  className,
  ...props
}) => {
  const { t } = useTranslation();
  const toolEntries =
    resolvedTools && resolvedTools.length > 0
      ? resolvedTools.map((t) => ({ key: t.slug, label: t.name }))
      : item.tools.map((slug) => ({ key: slug, label: slug }));
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

      <div
        className={css({
          bg: 'mint',
          color: 'white',
          px: 6,
          py: 3,
          fontSize: 'xs',
          fontWeight: 'semibold',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
        })}
      >
        {t('clients.processAndTools')}
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
            {toolEntries.map((tool) => (
              <li key={tool.key} className={css({})}>
                {tool.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {resolvedTeam.length > 0 && (
        <div className={sectionStyle}>
          <div className={flex({ gap: 3, align: 'start' })}>
            <UsersIcon className={iconSizeLg} />
            <div className={flex({ gap: 2, wrap: 'wrap' })}>
              {resolvedTeam.map((member) =>
                member.avatar ? (
                  <Avatar
                    key={member.slug}
                    src={member.avatar}
                    alt={member.name}
                    title={member.name}
                    className={circle({ size: '32px' })}
                  />
                ) : (
                  <span
                    key={member.slug}
                    className={css({ fontSize: 'sm', color: 'gray.600' })}
                    title={member.name}
                  >
                    {member.name}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

StoryMetas.displayName = 'StoryMetas';

export { StoryMetas };
