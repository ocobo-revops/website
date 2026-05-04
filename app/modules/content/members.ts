import { getPrivateEnvVars } from '../env.server';
import {
  type MemberFrontmatter,
  MemberFrontmatterSchema,
  type MemberTrack,
} from '../schemas';
import { fetchContents } from './api';
import { createValidator } from './processor';

export type Member = MemberFrontmatter & { slug: string };
export type MemberRegistry = Record<string, Member>;

const memberValidator = createValidator<MemberFrontmatter>(
  MemberFrontmatterSchema,
  'Member',
);

export async function fetchMembers() {
  return fetchContents('team', memberValidator);
}

export function resolveMember(
  slug: string,
  registry: MemberRegistry,
): Member | null {
  return registry[slug] ?? null;
}

const byDisplayOrder = (a: Member, b: Member) =>
  a.displayOrder - b.displayOrder || a.slug.localeCompare(b.slug);

export function getActiveMembers(registry: MemberRegistry): Member[] {
  return Object.values(registry)
    .filter((m) => m.active)
    .sort(byDisplayOrder);
}

export function getMembersByTrack(
  registry: MemberRegistry,
  track: MemberTrack,
): Member[] {
  return Object.values(registry)
    .filter((m) => m.active && m.track === track)
    .sort(byDisplayOrder);
}

export function getFeaturedAboutMembers(registry: MemberRegistry): Member[] {
  return Object.values(registry)
    .filter((m) => m.active && m.featuredOnAboutUs)
    .sort(byDisplayOrder);
}

// Process-level cache — invalidated on redeploy (matches contacts.ts pattern).
let _cachedRegistry: MemberRegistry | null = null;
let _cacheKey: string | null = null;

export function __resetMemberRegistryCache(): void {
  _cachedRegistry = null;
  _cacheKey = null;
}

export async function loadMemberRegistry(): Promise<MemberRegistry> {
  const { readContentFrom, githubBranch } = getPrivateEnvVars();
  const cacheKey = `${readContentFrom}:${githubBranch ?? 'local'}`;
  if (_cachedRegistry && _cacheKey === cacheKey) return _cachedRegistry;

  const [status, state, files] = await fetchMembers();

  if (status !== 200 || state !== 'success' || !files) {
    console.error(
      `[MemberRegistry] Failed to load: status=${status} state=${state}`,
    );
    return {};
  }

  const registry: MemberRegistry = {};
  for (const file of files) {
    registry[file.slug] = { slug: file.slug, ...file.frontmatter };
  }

  _cachedRegistry = registry;
  _cacheKey = cacheKey;
  return registry;
}
