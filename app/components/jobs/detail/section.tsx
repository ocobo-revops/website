import * as React from 'react';

import type { RenderableTreeNode } from '@markdoc/markdoc';
import Markdoc from '@markdoc/markdoc';

import { css } from '@ocobo/styled-system/css';
import { badge } from '@ocobo/styled-system/recipes';

import {
  Heading,
  Link,
  List,
  ListItem,
  Paragraph,
  Quote,
} from '~/components/PageMarkdownContainer';

// Shift headings up one level: h3→h2 (section titles), h4→h3 (subsections)
function ShiftedHeading({
  level = 2,
  ...props
}: React.ComponentProps<typeof Heading>) {
  // Clamp at h2 — h1 is reserved for the job title in the page header
  return <Heading level={Math.max(2, level - 1)} {...props} />;
}

type JobCalloutProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
};

function JobCallout({ children, title, ...props }: JobCalloutProps) {
  return (
    <div
      className={css({
        p: '6',
        borderRadius: 'xl',
        bg: 'gray.50',
        borderWidth: '1px',
        borderColor: 'gray.200',
        '& ul': { pl: '0', listStyleType: 'none' },
        '& li': {
          color: 'gray.700',
          fontSize: 'base',
          lineHeight: 'relaxed',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '2',
          mb: '2',
          _last: { mb: '0' },
        },
        '& li::before': {
          content: '"→"',
          color: 'ocobo.dark',
          fontWeight: 'bold',
          flexShrink: 0,
          mt: '0.5',
        },
      })}
      {...props}
    >
      {title && (
        <span
          className={`${badge({ variant: 'mint', size: 'sm' })} ${css({ mb: '4', display: 'inline-block' })}`}
        >
          {title}
        </span>
      )}
      {children}
    </div>
  );
}

const components = {
  Callout: JobCallout,
  Heading: ShiftedHeading,
  Link,
  List,
  ListItem,
  Paragraph,
  Quote,
};

type SectionProps = {
  nodes: RenderableTreeNode[];
};

export function Section({ nodes }: SectionProps) {
  return (
    <div
      className={css({
        // Body text
        '& p': { lineHeight: 'relaxed', color: 'gray.700' },
        '& li': { lineHeight: 'relaxed', color: 'gray.700' },

        // Top-level flow spacing
        '& > * + *': { mt: '5' },

        // Section title (h2): first child — breathing room below
        '& > h2': { mb: '6' },
        '& > h2 + *': { mt: '0' },

        // Subsection heading (h3): large gap above, medium below
        '& > h3': { mt: '10' },
        '& > h3:first-child': { mt: '0' },
        '& > h3 + *': { mt: '3' },

        // Callout internal spacing
        '& > div > * + *': { mt: '3' },
      })}
    >
      {nodes.map((node, i) => {
        const rendered = Markdoc.renderers.react(node, React, { components });
        return <React.Fragment key={i}>{rendered}</React.Fragment>;
      })}
    </div>
  );
}
