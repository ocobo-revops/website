import type { Node } from '@markdoc/markdoc';

export type TocEntry = {
  id: string;
  title: string;
  level: number;
};

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function extractNodeText(node: Node): string {
  if (node.type === 'text') return String(node.attributes.content ?? '');
  return node.children.map(extractNodeText).join('');
}

export function extractFirstParagraph(ast: Node): string | null {
  for (const node of ast.walk()) {
    if (node.type === 'paragraph') {
      const text = extractNodeText(node).trim();
      if (text) return text;
    }
  }
  return null;
}

/**
 * Walks the AST and writes a unique `id` attribute onto every heading
 * node that doesn't already have one. Repeated heading text gets a
 * numeric suffix (`-2`, `-3`, …) so anchors and TOC entries stay unique.
 *
 * Deterministic for a given input AST, so calling it independently on
 * two parses of the same markdown (e.g. once in the processor before
 * `Markdoc.transform`, once in a route before `extractToc`) yields the
 * same ids — keeping rendered headings and TOC links in sync.
 */
export function assignUniqueHeadingIds(ast: Node): void {
  const counts = new Map<string, number>();

  for (const node of ast.walk()) {
    if (node.type !== 'heading') continue;
    if (node.attributes.id) continue;

    const baseId = slugify(extractNodeText(node).trim());
    if (!baseId) continue;

    const seen = counts.get(baseId) ?? 0;
    const id = seen === 0 ? baseId : `${baseId}-${seen + 1}`;
    counts.set(baseId, seen + 1);
    node.attributes.id = id;
  }
}

export function extractToc(ast: Node, maxLevel = 3): TocEntry[] {
  assignUniqueHeadingIds(ast);
  const entries: TocEntry[] = [];

  for (const node of ast.walk()) {
    if (node.type !== 'heading') continue;

    const level = Number(node.attributes.level);
    if (level < 2 || level > maxLevel) continue;

    const title = extractNodeText(node).trim();
    const id = node.attributes.id ? String(node.attributes.id) : slugify(title);

    entries.push({ id, title, level });
  }

  return entries;
}
