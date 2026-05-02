import * as React from 'react';

import type { RenderableTreeNode } from '@markdoc/markdoc';
import Markdoc from '@markdoc/markdoc';

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
    <>
      {nodes.map((node, i) => {
        const rendered = Markdoc.renderers.react(node, React, { components });
        return <React.Fragment key={i}>{rendered}</React.Fragment>;
      })}
    </>
  );
}
