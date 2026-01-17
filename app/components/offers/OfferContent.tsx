import type { RenderableTreeNode } from '@markdoc/markdoc';
import { PageMarkdownContainer } from '../PageMarkdownContainer';

interface OfferContentProps {
  content: RenderableTreeNode;
}

export function OfferContent({ content }: OfferContentProps) {
  return <PageMarkdownContainer content={content} />;
}
