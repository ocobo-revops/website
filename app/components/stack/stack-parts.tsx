import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import type {
  StackAccent,
  StackLayer,
  StackTool,
} from '~/modules/revenue-stack';

// One static class per accent: Panda only ships literal values (CLAUDE.md §7).
export const accentDots: Record<StackAccent | 'yellow', string> = {
  mint: css({ bg: 'mint' }),
  sky: css({ bg: 'sky' }),
  ai: css({ bgGradient: 'ai' }),
  coral: css({ bg: 'coral' }),
  yellow: css({ bg: 'yellow' }),
};

const labelStyles = {
  light: css({ color: 'gray' }),
  dark: css({ color: 'white/55' }),
};

type StackLabelProps = {
  accent: StackAccent | 'yellow';
  tone?: keyof typeof labelStyles;
  children: ReactNode;
};

/** The small uppercase label with its colour dot, as "01 · Signaux". */
export function StackLabel({
  accent,
  tone = 'light',
  children,
}: StackLabelProps) {
  return (
    <span
      className={cx(
        text({ variant: 'label' }),
        css({
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2',
          fontWeight: 'bold',
          letterSpacing: 'tag',
          whiteSpace: 'nowrap',
        }),
        labelStyles[tone],
      )}
    >
      <span
        aria-hidden="true"
        className={cx(
          css({ w: 'dot', h: 'dot', borderRadius: 'full', flex: 'none' }),
          accentDots[accent],
        )}
      />
      {children}
    </span>
  );
}

/** The tool's logo, or its first letter when the stack has none. */
export function ToolIcon({ tool }: { tool: StackTool }) {
  return (
    <span
      aria-hidden="true"
      className={css({
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
        w: '6',
        h: '6',
        borderRadius: 'md',
        bg: 'ocobo.gray',
        overflow: 'hidden',
        fontSize: 'label',
        fontWeight: 'extrabold',
        color: 'gray.600',
      })}
    >
      {tool.logo ? (
        <img
          src={tool.logo}
          alt=""
          width={14}
          height={14}
          loading="lazy"
          className={css({ w: '3.5', h: '3.5', objectFit: 'contain' })}
        />
      ) : (
        tool.name.charAt(0)
      )}
    </span>
  );
}

type ToolChipsProps = {
  tools: readonly StackTool[];
  /** From `@/5xl`, keeps the chips on one line beside the title. */
  inline?: boolean;
};

export function ToolChips({ tools, inline = false }: ToolChipsProps) {
  return (
    <ul
      // `list-style: none` drops list semantics in Safari.
      role="list"
      className={cx(
        css({ display: 'flex', flexWrap: 'wrap', gap: '2' }),
        inline
          ? css({ '@/5xl': { flexWrap: 'nowrap', flex: 'none' } })
          : undefined,
      )}
    >
      {tools.map((tool) => (
        <li
          key={tool.name}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2',
            h: '9',
            pl: '1.5',
            pr: '3',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'line',
            borderRadius: 'full',
            bg: 'white',
            fontSize: 'caption',
            fontWeight: 'semibold',
            color: 'dark',
            whiteSpace: 'nowrap',
          })}
        >
          <ToolIcon tool={tool} />
          {tool.name}
        </li>
      ))}
    </ul>
  );
}

const rowBorder = css({
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'line',
  _last: { borderBottomWidth: '0', pb: '0' },
});

/** Tools with their role, one per row. */
export function ToolList({ tools }: { tools: readonly StackTool[] }) {
  const { t } = useTranslation('stack');

  return (
    <ul
      role="list"
      className={css({
        mt: '4',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'line',
      })}
    >
      {tools.map((tool) => (
        <li
          key={tool.name}
          className={cx(
            css({
              display: 'flex',
              alignItems: 'center',
              gap: '2.5',
              py: '2.5',
              fontSize: 'sm',
            }),
            rowBorder,
          )}
        >
          <ToolIcon tool={tool} />
          <span className={css({ fontWeight: 'semibold', color: 'dark' })}>
            {tool.name}
          </span>
          {tool.role ? (
            <span
              className={css({
                ml: 'auto',
                fontSize: 'xs',
                fontWeight: 'medium',
                color: 'gray.400',
                textAlign: 'right',
              })}
            >
              {t(`roles.${tool.role}`)}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/**
 * A layer's copy: "01 · Signaux", its title and its text. Execution has no
 * text key, and `RowCard` reads none.
 */
export function useLayerCopy(layer: StackLayer) {
  const { t } = useTranslation('stack');
  return {
    heading: t('layerHeading', {
      number: layer.number,
      label: t(`layers.${layer.id}.label`),
    }),
    title: t(`layers.${layer.id}.title`),
    text: t(`layers.${layer.id}.text`),
  };
}

// The prototype's 19px Bermia title. ADR 0002 keeps Bermia for H2 and
// above, so it takes the bold body size, as other small card titles do.
export const layerTitle = cx(
  text({ variant: 'body' }),
  // `app/index.css` sets headings in Bermia: the body font comes back here.
  css({
    fontFamily: 'body',
    fontWeight: 'bold',
    lineHeight: 'snug',
    color: 'dark',
  }),
);

export const layerText = cx(
  text({ variant: 'small', color: 'muted' }),
  css({ mt: '1.5' }),
);
