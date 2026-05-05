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

export function extractToc(ast: Node, maxLevel = 3): TocEntry[] {
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
