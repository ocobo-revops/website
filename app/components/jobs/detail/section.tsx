import * as React from 'react';

import type { RenderableTreeNode } from '@markdoc/markdoc';
import Markdoc from '@markdoc/markdoc';

import { css } from '@ocobo/styled-system/css';

import {
  Callout,
  Heading,
  Link,
  List,
  ListItem,
  Paragraph,
  Quote,
} from '~/components/PageMarkdownContainer';

// Shift headings up one level so h3→h2 (bigger section titles) and h4→h3
function ShiftedHeading({
  level = 2,
  ...props
}: React.ComponentProps<typeof Heading>) {
  return <Heading level={Math.max(1, level - 1)} {...props} />;
}

const components = {
  Callout,
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

        // Section title (h2, was h3): first child — breathing room below
        '& > h2': { mb: '6' },
        '& > h2 + *': { mt: '0' },

        // Subsection heading (h3, was h4): large gap above, medium below
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
