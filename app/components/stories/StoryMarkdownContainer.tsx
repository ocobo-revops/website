import type { HTMLAttributes } from 'react';

import type { RenderableTreeNode } from '@markdoc/markdoc';
import { QuoteIcon } from 'lucide-react';

import { css, cx } from '@ocobo/styled-system/css';
import { icon, subtitle } from '@ocobo/styled-system/recipes';

import { MarkdownContainer } from '../markdown-container';
import { PlayerYoutube } from '../PlayerYoutube';

export function Container({ children }: HTMLAttributes<HTMLElement>) {
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

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: number;
};

export function H1({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      {...props}
      className={css({
        textStyle: 'heading1',
      })}
    >
      {children}
    </h1>
  );
}

export function Heading({ children, level = 2, ...props }: HeadingProps) {
  if (level === 1 || level === 2) {
    return (
      <h2
        {...props}
        className={css({
          mb: '2rem',
          position: 'relative',
          _before: {
            content: '""',
            position: 'absolute',
            bottom: '50%',
            left: '0',
            width: 'full',
            height: '1px',
            bg: 'dark',
            zIndex: 0,
          },
        })}
      >
        <div />
        <span className={subtitle()}>{children}</span>
      </h2>
    );
  }
  if (level === 3) {
    return (
      <h3
        {...props}
        className={css({
          textStyle: 'heading2',
          maxW: { base: '100%', lg: '3/4' },
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
          textStyle: 'large',
          maxW: { base: '100%', lg: '3/4' },
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
        textStyle: 'medium',
        fontWeight: 'bold',
        maxW: { base: '100%', lg: '3/4' },
      })}
    >
      {children}
    </h5>
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

type ListProps = HTMLAttributes<HTMLElement> & {
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
          maxW: { base: '100%', lg: '3/4' },
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
        maxW: { base: '100%', lg: '3/4' },
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
}: HTMLAttributes<HTMLLIElement>) {
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
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      {...props}
      className={css({
        textStyle: 'medium',
        maxW: { base: '100%', lg: '3/4' },
      })}
    >
      {children}
    </p>
  );
}

export function Table({
  children,
  ...props
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <div>
      <table {...props} className="border-collapse">
        {children}
      </table>
    </div>
  );
}

export function TH({
  children,
  ...props
}: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th {...props} className="p-2 border border-gray-300">
      {children}
    </th>
  );
}

type TDProps = HTMLAttributes<HTMLTableCellElement> & {
  color?: 'green' | 'red' | 'default';
};

export function TD({ children, ...props }: TDProps) {
  return (
    <td {...props} className="">
      {children}
    </td>
  );
}

type QuoteProps = HTMLAttributes<HTMLElement> & {
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
            color: 'mint',
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

type YoutubeProps = HTMLAttributes<HTMLElement> & {
  id?: string;
  title?: string;
};

function YoutubePlayer({ id, title, ...props }: YoutubeProps) {
  if (!id) {
    return null;
  }
  return (
    <div {...props}>
      <PlayerYoutube id={id} title={title ?? ''} />
    </div>
  );
}

type StoryMarkdownContainerProps = {
  content: RenderableTreeNode;
};

export function StoryMarkdownContainer({
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
        // CodeBlock: CodeBlock,
        Link,
        // TweetEmbed: TweetEmbed,
        // Statement: Statement,
        Quote,
        Table,
        TH,
        TD,
        YoutubePlayer,
      }}
    />
  );
}
