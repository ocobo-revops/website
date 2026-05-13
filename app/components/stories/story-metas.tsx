import { ClockIcon, CpuIcon, MessageSquareTextIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { flex, vstack } from '@ocobo/styled-system/patterns';

import type { Tool } from '~/modules/content';
import { StoryFrontmatter } from '~/types';

interface ToolEntry {
  key: string;
  label: string;
}

function prepareToolEntries(
  resolvedTools: Tool[] | undefined,
  rawTools: string[],
): ToolEntry[] {
  if (resolvedTools && resolvedTools.length > 0) {
    return resolvedTools.map((t) => ({ key: t.slug, label: t.name }));
  }
  return rawTools.map((slug) => ({ key: slug, label: slug }));
}

interface StoryMetasProps extends React.HTMLAttributes<HTMLDivElement> {
  item: StoryFrontmatter;
  resolvedTools?: Tool[];
}

const iconBoxStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  w: '10',
  h: '10',
  bg: 'gray.50',
  rounded: 'xl',
  color: 'ocobo.dark',
  flexShrink: '0',
});

const rowLabelStyle = css({
  fontSize: 'xs',
  fontWeight: 'black',
  color: 'gray.400',
  textTransform: 'uppercase',
  letterSpacing: 'widest',
  mb: '0.5',
});

const rowValueStyle = css({
  fontSize: 'sm',
  fontWeight: 'bold',
  color: 'ocobo.dark',
});

const chipStyle = css({
  fontSize: 'xs',
  fontWeight: 'bold',
  bg: 'white',
  borderWidth: '1px',
  borderColor: 'gray.100',
  px: '2',
  py: '0.5',
  rounded: 'sm',
  color: 'gray.500',
});

const StoryMetas: React.FunctionComponent<StoryMetasProps> = ({
  item,
  resolvedTools,
  className,
  ...props
}: StoryMetasProps) => {
  const { t } = useTranslation();
  const toolEntries = prepareToolEntries(resolvedTools, item.tools);

  return (
    <div
      className={`${css({
        bg: 'white',
        borderWidth: '1px',
        borderColor: 'gray.100',
        p: '10',
        rounded: '3xl',
        shadow: 'sm',
        mb: '6',
      })}${className ? ` ${className}` : ''}`}
      {...props}
    >
      <h4
        className={css({
          fontFamily: 'display',
          fontWeight: 'black',
          fontSize: 'xs',
          textTransform: 'uppercase',
          letterSpacing: '0.4em',
          color: 'ocobo.dark',
          mb: '8',
        })}
      >
        {t('clients.processAndTools')}
      </h4>

      <div className={vstack({ gap: '8', alignItems: 'start' })}>
        <div className={flex({ gap: '5', align: 'center' })}>
          <div className={iconBoxStyle}>
            <ClockIcon size={18} />
          </div>
          <div>
            <p className={rowLabelStyle}>{t('clients.duration')}</p>
            <p className={rowValueStyle}>{item.duration}</p>
          </div>
        </div>

        {item.scopes.length > 0 && (
          <div className={flex({ gap: '5', align: 'center' })}>
            <div className={iconBoxStyle}>
              <MessageSquareTextIcon size={18} />
            </div>
            <div>
              <p className={rowLabelStyle}>{t('clients.scopes')}</p>
              <ul>
                {item.scopes.map((scope) => (
                  <li key={scope} className={rowValueStyle}>
                    {scope}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {toolEntries.length > 0 && (
          <div className={flex({ gap: '5', align: 'start' })}>
            <div className={iconBoxStyle}>
              <CpuIcon size={18} />
            </div>
            <div>
              <p className={rowLabelStyle}>{t('clients.techStack')}</p>
              <div
                className={`${flex({ wrap: 'wrap', gap: '2' })} ${css({ mt: '1' })}`}
              >
                {toolEntries.map((tool) => (
                  <span key={tool.key} className={chipStyle}>
                    {tool.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

StoryMetas.displayName = 'StoryMetas';

export { StoryMetas, prepareToolEntries };
