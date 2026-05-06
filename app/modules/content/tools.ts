import { getPrivateEnvVars } from '../env.server';
import { type ToolFrontmatter, ToolFrontmatterSchema } from '../schemas';
import { fetchContents } from './api';
import { createValidator } from './processor';

export type Tool = ToolFrontmatter & { slug: string };
export type ToolRegistry = Record<string, Tool>;

const toolValidator = createValidator<ToolFrontmatter>(
  ToolFrontmatterSchema,
  'Tool',
);

export async function fetchTools() {
  return fetchContents('tools', toolValidator);
}

export function resolveTool(slug: string, registry: ToolRegistry): Tool | null {
  const direct = registry[slug];
  if (direct) return direct;
  const lowered = slug.toLowerCase();
  return registry[lowered] ?? null;
}

let _cachedRegistry: ToolRegistry | null = null;
let _cacheKey: string | null = null;

export function __resetToolRegistryCache(): void {
  _cachedRegistry = null;
  _cacheKey = null;
}

export async function loadToolRegistry(): Promise<ToolRegistry> {
  const { readContentFrom, githubBranch } = getPrivateEnvVars();
  const cacheKey = `${readContentFrom}:${githubBranch ?? 'local'}`;
  if (_cachedRegistry && _cacheKey === cacheKey) return _cachedRegistry;

  const [status, state, files] = await fetchTools();

  if (status !== 200 || state !== 'success' || !files) {
    console.error(
      `[ToolRegistry] Failed to load: status=${status} state=${state}`,
    );
    return {};
  }

  const registry: ToolRegistry = {};
  for (const file of files) {
    registry[file.slug] = { slug: file.slug, ...file.frontmatter };
  }

  _cachedRegistry = registry;
  _cacheKey = cacheKey;
  return registry;
}
