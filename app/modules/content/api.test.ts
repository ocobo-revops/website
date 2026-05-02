/**
 * Tests for the generic content API
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ContentSource } from './types';

// Mock environment variables before importing modules
vi.mock('../env.server', () => ({
  getPrivateEnvVars: () => ({
    githubAccount: 'test-account',
    githubRepo: 'test-repo',
    githubAccessToken: 'test-token',
    readContentFrom: 'test',
  }),
}));

// Mock filesystem operations to avoid actual file system access
vi.mock('./sources/filesystem', () => ({
  FilesystemContentSource: class MockFilesystemContentSource {
    async fetchSingle() {
      return [404, 'not_found', undefined];
    }
    async fetchMultiple() {
      return [200, 'success', []];
    }
    async fetchMetadata() {
      return [200, 'success', []];
    }
  },
}));

// Mock GitHub API to avoid actual network requests
vi.mock('./sources/github', () => ({
  GitHubContentSource: class MockGitHubContentSource {
    async fetchSingle() {
      return [404, 'not_found', undefined];
    }
    async fetchMultiple() {
      return [200, 'success', []];
    }
    async fetchMetadata() {
      return [200, 'success', []];
    }
  },
}));

// Import after mocking
import {
  ContentValidators,
  GenericContentFetcher,
  fetchJob,
  fetchJobs,
} from './api';

// Mock content source for testing
const mockContentSource: ContentSource = {
  async fetchSingle<_T>(
    _path: string,
    slug: string,
    _validator: any,
  ): Promise<any> {
    if (slug === 'test-story') {
      return [
        200,
        'success',
        {
          slug: 'test-story',
          frontmatter: {
            name: 'Test Client',
            date: '2024-01-01',
            title: 'Test Story',
            subtitle: 'Test Subtitle',
            description: 'Test Description',
            speaker: 'John Doe',
            role: 'CEO',
            duration: '1 month',
            scopes: [],
            tags: [],
            tools: [],
            quotes: [],
            deliverables: [],
          },
          content: {},
          markdown: '# Test Story\n\nTest content',
        },
      ];
    }
    return [404, 'not_found', undefined];
  },

  async fetchMultiple<_T>(_path: string, _validator: any): Promise<any> {
    return [200, 'success', []];
  },

  async fetchMetadata(_path: string): Promise<any> {
    return [200, 'success', []];
  },
};

describe('GenericContentFetcher', () => {
  let fetcher: GenericContentFetcher;

  beforeEach(() => {
    // Pass the mock content source explicitly
    fetcher = new GenericContentFetcher(mockContentSource);
  });

  describe('fetchSingle', () => {
    it('should fetch a single story successfully', async () => {
      const [status, state, data] = await fetcher.fetchSingle(
        '/test/path',
        'test-story',
        ContentValidators.story,
      );

      expect(status).toBe(200);
      expect(state).toBe('success');
      expect(data).toBeDefined();
      expect(data?.slug).toBe('test-story');
      expect(data?.frontmatter.name).toBe('Test Client');
    });

    it('should return not_found for missing content', async () => {
      const [status, state, data] = await fetcher.fetchSingle(
        '/test/path',
        'missing-story',
        ContentValidators.story,
      );

      expect(status).toBe(404);
      expect(state).toBe('not_found');
      expect(data).toBeUndefined();
    });
  });

  describe('fetchMultiple', () => {
    it('should fetch multiple stories successfully', async () => {
      const [status, state, data] = await fetcher.fetchMultiple(
        '/test/path',
        ContentValidators.story,
      );

      expect(status).toBe(200);
      expect(state).toBe('success');
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('ContentValidators', () => {
    it('should have validators for all content types', () => {
      expect(ContentValidators.story).toBeDefined();
      expect(ContentValidators.story.typeName).toBe('Story');
      expect(ContentValidators.story.schema).toBeDefined();
      expect(typeof ContentValidators.story.isValid).toBe('function');

      expect(ContentValidators.blogpost).toBeDefined();
      expect(ContentValidators.blogpost.typeName).toBe('Blogpost');

      expect(ContentValidators.page).toBeDefined();
      expect(ContentValidators.page.typeName).toBe('Page');
    });

    it('should validate correct story data', () => {
      const validStoryData = {
        name: 'Test Client',
        date: '2024-01-01',
        title: 'Test Story',
        subtitle: 'Test Subtitle',
        description: 'Test Description',
        speaker: 'John Doe',
        role: 'CEO',
        duration: '1 month',
        scopes: [],
        tags: [],
        tools: [],
        quotes: [],
        deliverables: [],
      };

      expect(ContentValidators.story.isValid(validStoryData)).toBe(true);
    });

    it('should reject invalid story data', () => {
      const invalidStoryData = {
        name: 'Test Client',
        // Missing required fields
      };

      expect(ContentValidators.story.isValid(invalidStoryData)).toBe(false);
    });

    it('should have a job validator', () => {
      expect(ContentValidators.job).toBeDefined();
      expect(ContentValidators.job.typeName).toBe('Job');
    });
  });
});

describe('fetchJobs', () => {
  it('should return an array of jobs', async () => {
    const [status, state, data] = await fetchJobs('fr');
    expect(status).toBe(200);
    expect(state).toBe('success');
    expect(Array.isArray(data)).toBe(true);
  });
});

describe('fetchJob', () => {
  it('should return not_found for an unknown slug', async () => {
    const [status, state, data] = await fetchJob('unknown-job', 'fr');
    expect(status).toBe(404);
    expect(state).toBe('not_found');
    expect(data).toBeUndefined();
  });
});
