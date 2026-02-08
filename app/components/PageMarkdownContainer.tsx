import * as React from 'react';

import type { RenderableTreeNode } from '@markdoc/markdoc';
import { QuoteIcon } from 'lucide-react';
import { useHydrated } from 'remix-utils/use-hydrated';

import { css, cx } from '@ocobo/styled-system/css';
import { icon } from '@ocobo/styled-system/recipes';

import { createHubSpotForm, loadHubSpotScript } from '~/utils/hubspot';

import { MarkdownContainer } from './MarkdowContainer';

export function Container({ children }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div
      className={css({
        '& p, h3, h4, h5, h6, ol, ul, blockquote': {
          '& + *': {
            mt: '1em',
          },
        },
      })}
    >
      {children}
    </div>
  );
}

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  level?: number;
};

export function H1({
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      {...props}
      className={css({
        fontFamily: 'display',
        fontSize: { base: '3xl', md: '4xl', lg: '5xl' },
        fontWeight: 'black',
        letterSpacing: 'tight',
        color: 'ocobo.dark',
      })}
    >
      {children}
    </h1>
  );
}

export function Heading({ children, level = 2, ...props }: HeadingProps) {
  if (level === 1) {
    return (
      <h1
        {...props}
        className={css({
          fontFamily: 'display',
          fontSize: { base: '3xl', md: '4xl', lg: '5xl' },
          fontWeight: 'black',
          letterSpacing: 'tight',
          color: 'ocobo.dark',
        })}
      >
        {children}
      </h1>
    );
  }
  if (level === 2) {
    return (
      <h2
        {...props}
        className={css({
          fontFamily: 'display',
          fontSize: { base: '2xl', md: '3xl' },
          fontWeight: 'bold',
          letterSpacing: 'tight',
          color: 'ocobo.dark',
        })}
      >
        {children}
      </h2>
    );
  }
  if (level === 3) {
    return (
      <h3
        {...props}
        className={css({
          fontFamily: 'display',
          fontSize: { base: 'xl', md: '2xl' },
          fontWeight: 'bold',
          color: 'ocobo.dark',
        })}
      >
        {children}
      </h3>
    );
  }
  if (level === 4) {
    return (
      <h4
        {...props}
        className={css({
          fontSize: 'lg',
          fontWeight: 'semibold',
          color: 'ocobo.dark',
        })}
      >
        {children}
      </h4>
    );
  }
  return (
    <h5
      {...props}
      className={css({
        fontSize: 'md',
        fontWeight: 'bold',
        color: 'ocobo.dark',
      })}
    >
      {children}
    </h5>
  );
}

type ListProps = React.HTMLAttributes<HTMLElement> & {
  ordered?: boolean;
};

export function List({ children, ordered, ...props }: ListProps) {
  if (ordered) {
    return (
      <ol
        className={css({
          textStyle: 'medium',
          listStyleType: 'decimal',
          pl: '1em',
        })}
        {...props}
      >
        {children}
      </ol>
    );
  }
  return (
    <ul
      className={css({
        textStyle: 'medium',
        listStyleType: 'disc',
        pl: '1em',
      })}
      {...props}
    >
      {children}
    </ul>
  );
}

export function ListItem({
  children,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li
      className={css({
        mb: '0.5em',
        _last: {
          mb: 0,
        },
      })}
      {...props}
    >
      {children}
    </li>
  );
}

export function Paragraph({
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      {...props}
      className={css({
        textStyle: 'medium',
      })}
    >
      {children}
    </p>
  );
}

export function Table({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <table
      {...props}
      className={css({
        borderCollapse: 'collapse',
        maxWidth: '100%',
        mb: '2em',
        textStyle: 'small',
        '& th, & td': {
          border: '1px solid',
          borderColor: 'gray',
          py: '0.5em',
          px: '0.5em',
        },
      })}
    >
      {children}
    </table>
  );
}

export function TH({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={css({
        fontWeight: 'bold',
        textAlign: 'left',
        bg: 'gray.light',
      })}
    >
      {children}
    </th>
  );
}

type TDProps = React.HTMLAttributes<HTMLTableCellElement> & {
  color?: 'green' | 'red' | 'default';
};

export function TD({ children, ...props }: TDProps) {
  return <td {...props}>{children}</td>;
}

type QuoteProps = React.HTMLAttributes<HTMLElement> & {
  author?: string;
  url?: string;
};

export function Quote({ children, author, url, ...props }: QuoteProps) {
  return (
    <blockquote cite={url} className={css({ fontStyle: 'italic' })} {...props}>
      <QuoteIcon
        className={cx(
          icon({ size: 'md' }),
          css({
            display: 'inline-block',
            mr: '0.5em',
            color: 'sky',
            float: 'left',
            translateY: '4px',
          }),
        )}
      />
      {children}

      {author && (
        <aside className="inline">
          <span className="text-3xl font-bold"> &minus;</span>
          <cite> {author}</cite>
        </aside>
      )}
    </blockquote>
  );
}

export function Link({
  href = '/404',
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      className={css({
        textDecoration: 'underline',
      })}
      {...props}
    >
      {children}
    </a>
  );
}

export function Callout({
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={css({
        p: 4,
        mb: 4,
        bleft: 'sky',
        bg: 'sky.light',
      })}
      {...props}
    >
      {children}
    </div>
  );
}

type AushaPlayerProps = React.IframeHTMLAttributes<HTMLIFrameElement> & {
  podcastId?: string;
  showId?: string;
  title?: string;
};

export function AushaPlayer({ podcastId, showId, title }: AushaPlayerProps) {
  const playerId = `ausha-${podcastId}`;
  const showIdParam = showId ? `showId=${showId}&` : ``;
  const src = `https://player.ausha.co/?${showIdParam}color=%23FE9C87&podcastId=${podcastId}&v=3&playerId=${playerId}`;

  return (
    <iframe
      title={title || 'Ausha Podcast Player'}
      loading="lazy"
      id={playerId}
      height="220"
      width="100%"
      src={src}
    />
  );
}

type HubspotFormProps = React.HTMLAttributes<HTMLDivElement> & {
  formId?: string;
};

export function HubspotForm({ formId }: HubspotFormProps) {
  const isHydrated = useHydrated();
  const scriptsLoaded = React.useRef(false);

  React.useEffect(() => {
    if (!isHydrated || scriptsLoaded.current || !formId) return;
    loadHubSpotScript()
      .then(() => {
        createHubSpotForm(formId, '.hubspot-form');
      })
      .catch((error) => {
        console.error('Error loading scripts', error);
      });
    scriptsLoaded.current = true;
  }, [isHydrated, formId]);

  return (
    <div
      className={cx(
        css({
          p: 4,
          mb: 4,
          bleft: 'mint',
          bg: 'mint.light',
        }),
        'hubspot-form',
      )}
    />
  );
}

type StoryMarkdownContainerProps = {
  content: RenderableTreeNode;
};

export function PageMarkdownContainer({
  content,
  ...props
}: StoryMarkdownContainerProps) {
  return (
    <MarkdownContainer
      {...props}
      content={content}
      components={{
        Container,
        Heading,
        Paragraph,
        List,
        ListItem,
        Link,
        Quote,
        Table,
        TH,
        TD,
        Callout,
        AushaPlayer,
        HubspotForm,
      }}
    />
  );
}
