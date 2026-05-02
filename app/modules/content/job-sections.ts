import Markdoc, { type RenderableTreeNode } from '@markdoc/markdoc';

const { Tag } = Markdoc;

const SECTION_IDS = ['mission', 'competences', 'pourquoi'] as const;
type SectionId = (typeof SECTION_IDS)[number];

export type JobSections = Record<SectionId, RenderableTreeNode[]>;

function isH3WithId(node: RenderableTreeNode, id: SectionId): boolean {
  return (
    node instanceof Tag &&
    node.name === 'Heading' &&
    node.attributes.level === 3 &&
    node.attributes.id === id
  );
}

function isAnyH3(node: RenderableTreeNode): boolean {
  return (
    node instanceof Tag &&
    node.name === 'Heading' &&
    node.attributes.level === 3
  );
}

export function extractJobSections(content: RenderableTreeNode): JobSections {
  if (!(content instanceof Tag)) {
    throw new Error('extractJobSections: expected a Tag node as root');
  }

  const children: RenderableTreeNode[] = content.children ?? [];
  const result = {} as JobSections;

  for (const sectionId of SECTION_IDS) {
    const startIdx = children.findIndex((node) => isH3WithId(node, sectionId));
    if (startIdx === -1) {
      throw new Error(
        `extractJobSections: missing required section "${sectionId}"`,
      );
    }

    const endIdx = children.findIndex(
      (node, idx) => idx > startIdx && isAnyH3(node),
    );

    result[sectionId] =
      endIdx === -1
        ? children.slice(startIdx)
        : children.slice(startIdx, endIdx);
  }

  return result;
}
