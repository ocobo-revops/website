import { readFile } from 'fs/promises';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getPrivateEnvVars } from '../env.server';
import {
  loadContactRegistry,
  parseContactsYaml,
  resolveContact,
} from './contacts';

vi.mock('fs/promises', () => ({
  default: { readFile: vi.fn() },
  readFile: vi.fn(),
}));

vi.mock('../env.server', () => ({
  getPrivateEnvVars: vi.fn(),
}));

const mockGetPrivateEnvVars = vi.mocked(getPrivateEnvVars);
const mockReadFile = vi.mocked(readFile);

const validYaml = `
aude:
  name: Aude Cadiot
  role: Co-fondatrice
  photo: aude-cadiot.jpg
  shortBio: Référence française du Revenue Operations.
benjamin:
  name: Benjamin Boileux
  role: Co-fondateur
  photo: benjamin-boileux.jpeg
`;

describe('parseContactsYaml', () => {
  it('should parse valid YAML into a ContactsRecord', () => {
    const registry = parseContactsYaml(validYaml);
    expect(registry['aude']).toBeDefined();
    expect(registry['aude'].name).toBe('Aude Cadiot');
    expect(registry['aude'].role).toBe('Co-fondatrice');
    expect(registry['benjamin']).toBeDefined();
  });

  it('should throw on invalid YAML syntax', () => {
    const brokenYaml = `aude:\n  name: [unclosed`;
    expect(() => parseContactsYaml(brokenYaml)).toThrow();
  });

  it('should throw when a contact is missing required fields', () => {
    const missingName = `aude:\n  role: Co-fondatrice\n  photo: aude.jpg`;
    expect(() => parseContactsYaml(missingName)).toThrow();
  });
});

describe('resolveContact', () => {
  it('should return the contact for a known ref', () => {
    const registry = parseContactsYaml(validYaml);
    const contact = resolveContact('aude', registry);
    expect(contact).not.toBeNull();
    expect(contact?.name).toBe('Aude Cadiot');
  });

  it('should return null for an unknown ref', () => {
    const registry = parseContactsYaml(validYaml);
    const contact = resolveContact('unknown-person', registry);
    expect(contact).toBeNull();
  });
});

describe('loadContactRegistry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reads _contacts.yml from filesystem when source is locale', async () => {
    mockGetPrivateEnvVars.mockReturnValue({
      readContentFrom: 'locale',
      localeRepoAPIUrl: '/fake/posts',
      githubRepoAPIUrl: '',
      githubAccessToken: '',
      githubBranch: 'main',
      env: 'development',
    });
    mockReadFile.mockResolvedValue(validYaml as any);

    const registry = await loadContactRegistry();

    expect(mockReadFile).toHaveBeenCalledWith(
      '/fake/posts/jobs/_contacts.yml',
      'utf8',
    );
    expect(registry['aude'].name).toBe('Aude Cadiot');
  });

  it('reads _contacts.yml from GitHub when source is github', async () => {
    mockGetPrivateEnvVars.mockReturnValue({
      readContentFrom: 'github',
      localeRepoAPIUrl: '',
      githubRepoAPIUrl: 'https://api.github.com/repos/org/posts/contents',
      githubAccessToken: 'ghp_test',
      githubBranch: 'feature/jobs',
      env: 'production',
    });

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => validYaml,
    });
    vi.stubGlobal('fetch', mockFetch);

    const registry = await loadContactRegistry();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('jobs/_contacts.yml'),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'token ghp_test' }),
      }),
    );
    expect(registry['aude'].name).toBe('Aude Cadiot');
  });

  it('throws when GitHub returns a non-ok response', async () => {
    mockGetPrivateEnvVars.mockReturnValue({
      readContentFrom: 'github',
      localeRepoAPIUrl: '',
      githubRepoAPIUrl: 'https://api.github.com/repos/org/posts/contents',
      githubAccessToken: 'ghp_test',
      githubBranch: 'main',
      env: 'production',
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 404 }),
    );

    await expect(loadContactRegistry()).rejects.toThrow('404');
  });
});
