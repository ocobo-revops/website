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
        '& > * + *': { mt: '5' },
        '& h3 + *': { mt: '6' },
        '& h4 + *': { mt: '3' },
        '& h3': { mb: '2' },
      })}
    >
      {nodes.map((node, i) => {
        const rendered = Markdoc.renderers.react(node, React, { components });
        return <React.Fragment key={i}>{rendered}</React.Fragment>;
      })}
    </div>
  );
}
