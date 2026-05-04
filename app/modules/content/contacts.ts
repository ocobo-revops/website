import { readFile } from 'fs/promises';
import yaml from 'js-yaml';
import { getPrivateEnvVars } from '../env.server';
import {
  type ContactsRecord,
  ContactsRecordSchema,
  type HiringContact,
} from '../schemas';

export function parseContactsYaml(raw: string): ContactsRecord {
  const parsed = yaml.load(raw);
  const result = ContactsRecordSchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('; ');
    throw new Error(`Invalid _contacts.yml: ${issues}`);
  }
  return result.data;
}

export function resolveContact(
  ref: string,
  registry: ContactsRecord,
): HiringContact | null {
  return registry[ref] ?? null;
}

// Process-level cache — invalidated on redeploy (new worker instance)
let _cachedRegistry: ContactsRecord | null = null;
let _cacheKey: string | null = null;

export async function loadContactRegistry(): Promise<ContactsRecord> {
  const {
    readContentFrom,
    localeRepoAPIUrl,
    githubRepoAPIUrl,
    githubAccessToken,
    githubBranch,
  } = getPrivateEnvVars();

  const cacheKey = `${readContentFrom}:${githubBranch ?? 'local'}`;
  if (_cachedRegistry && _cacheKey === cacheKey) return _cachedRegistry;

  let raw: string;

  if (readContentFrom === 'github') {
    const url = new URL(`${githubRepoAPIUrl}/jobs/_contacts.yml`);
    url.searchParams.set('ref', githubBranch);
    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/vnd.github.v3.raw',
        Authorization: `token ${githubAccessToken}`,
        'User-Agent': 'ocobo-content-fetcher',
      },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch _contacts.yml from GitHub: ${response.status}`,
      );
    }
    raw = await response.text();
  } else {
    raw = await readFile(`${localeRepoAPIUrl}/jobs/_contacts.yml`, 'utf8');
  }

  _cachedRegistry = parseContactsYaml(raw);
  _cacheKey = cacheKey;
  return _cachedRegistry;
}
