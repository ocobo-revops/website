import * as React from 'react';

import type { RenderableTreeNode } from '@markdoc/markdoc';
import Markdoc from '@markdoc/markdoc';

import { css } from '@ocobo/styled-system/css';

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
  return <Heading level={Math.max(1, level - 1)} {...props} />;
}

// Larger, Ocobo-branded callout for job descriptions
function JobCallout({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={css({
        p: '6',
        borderRadius: 'xl',
        bg: 'ocobo.yellow/10',
        borderWidth: '1px',
        borderColor: 'ocobo.yellow/30',
        '& p': {
          fontWeight: 'semibold',
          color: 'ocobo.dark',
          fontSize: 'base',
        },
        '& ul': { mt: '3', pl: '0', listStyleType: 'none' },
        '& li': {
          color: 'gray.700',
          fontSize: 'base',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '2',
          mb: '2',
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
