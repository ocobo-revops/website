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

const components = {
  Callout,
  Heading,
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

        // Section title (h3) is always the first child — give it breathing room below
        '& > h3': { mb: '6' },
        '& > h3 + *': { mt: '0' },

        // Subsection heading (h4): large gap above, medium below
        '& > h4': { mt: '10' },
        '& > h4:first-child': { mt: '0' },
        '& > h4 + *': { mt: '3' },

        // H4 visual accent (yellow left border)
        '& h4': {
          borderLeftWidth: '3px',
          borderColor: 'ocobo.yellow',
          pl: '4',
        },

        // Callout internal spacing (p → ul/ol inside the callout div)
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
