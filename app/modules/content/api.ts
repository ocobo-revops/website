/**
 * Generic content API
 *
 * This module provides the main API for content fetching that integrates
 * with the existing validation system and replaces the individual fetch functions.
 */

import type { MarkdocFile } from '~/types';
import {
  type ChallengeFrontmatter,
  ChallengeFrontmatterSchema,
} from '../challenge-schema';
import {
  type BlogpostFrontmatter,
  BlogpostFrontmatterSchema,
  type JobFrontmatter,
  JobFrontmatterSchema,
  type PageFrontmatter,
  PageFrontmatterSchema,
  type StoryFrontmatter,
  StoryFrontmatterSchema,
} from '../schemas';
import { getContentSource } from './factory';
import { createValidator } from './processor';
import type {
  ContentItemMetadata,
  ContentResult,
  ContentValidator,
} from './types';

/**
 * Pre-configured validators for existing content types
 */
export const ContentValidators = {
  story: createValidator<StoryFrontmatter>(StoryFrontmatterSchema, 'Story'),
  blogpost: createValidator<BlogpostFrontmatter>(
    BlogpostFrontmatterSchema,
    'Blogpost',
  ),
  page: createValidator<PageFrontmatter>(PageFrontmatterSchema, 'Page'),
  job: createValidator<JobFrontmatter>(JobFrontmatterSchema, 'Job'),
  challenge: createValidator<ChallengeFrontmatter>(
    ChallengeFrontmatterSchema,
    'Challenge',
  ),
} as const;

/**
 * Generic content fetcher class
 */
export class GenericContentFetcher {
  constructor(private contentSource = getContentSource()) {}

  /**
   * Fetch a single content file
   */
  async fetchSingle<T>(
    path: string,
    slug: string,
    validator: ContentValidator<T>,
    locale?: string,
  ): Promise<ContentResult<MarkdocFile<T>>> {
    return this.contentSource.fetchSingle(path, slug, validator, locale);
  }

  /**
   * Fetch multiple content files
   */
  async fetchMultiple<T>(
    path: string,
    validator: ContentValidator<T>,
    locale?: string,
  ): Promise<ContentResult<MarkdocFile<T>[]>> {
    return this.contentSource.fetchMultiple(path, validator, locale);
  }

  /**
   * Fetch content metadata
   */
  async fetchMetadata(
    path: string,
  ): Promise<ContentResult<ContentItemMetadata[]>> {
    return (
      this.contentSource.fetchMetadata?.(path) ?? [404, 'not_found', undefined]
    );
  }
}

/**
 * Specific content type fetchers for backward compatibility
 */
export class StoryFetcher extends GenericContentFetcher {
  async fetchStory(path: string, slug: string = '', locale?: string) {
    return this.fetchSingle(path, slug, ContentValidators.story, locale);
  }

  async fetchStories(path: string, locale?: string) {
    return this.fetchMultiple(path, ContentValidators.story, locale);
  }
}

export class BlogpostFetcher extends GenericContentFetcher {
  async fetchBlogpost(path: string, slug: string = '', locale?: string) {
    return this.fetchSingle(path, slug, ContentValidators.blogpost, locale);
  }

  async fetchBlogposts(path: string, locale?: string) {
    return this.fetchMultiple(path, ContentValidators.blogpost, locale);
  }
}

export class PageFetcher extends GenericContentFetcher {
  async fetchPage(path: string, slug: string = '', locale?: string) {
    return this.fetchSingle(path, slug, ContentValidators.page, locale);
  }

  async fetchPages(path: string, locale?: string) {
    return this.fetchMultiple(path, ContentValidators.page, locale);
  }
}

/**
 * Default instances for immediate use
 */
export const storyFetcher = new StoryFetcher();
export const blogpostFetcher = new BlogpostFetcher();
export const pageFetcher = new PageFetcher();
export const genericFetcher = new GenericContentFetcher();

/**
 * Simplified convenience functions - direct calls without complex caching
 * Caching is now handled at the HTTP response level in route loaders
 */
export async function fetchStory(slug: string = '', language: string = 'fr') {
  const path = `stories/${language}`;
  return storyFetcher.fetchStory(path, slug, language);
}

export async function fetchStories(language: string = 'fr') {
  const path = `stories/${language}`;
  return storyFetcher.fetchStories(path, language);
}

export async function fetchBlogpost(
  slug: string = '',
  language: string = 'fr',
) {
  const path = `blog/${language}`;
  return blogpostFetcher.fetchBlogpost(path, slug, language);
}

export async function fetchBlogposts(language: string = 'fr') {
  const path = `blog/${language}`;
  return blogpostFetcher.fetchBlogposts(path, language);
}

export async function fetchPage(
  path: string,
  slug: string = '',
  language: string = 'fr',
) {
  return pageFetcher.fetchPage(path, slug, language);
}

export async function fetchPages(path: string, language: string = 'fr') {
  return pageFetcher.fetchPages(path, language);
}

export async function fetchJobs(language = 'fr') {
  const path = `jobs/${language}`;
  return genericFetcher.fetchMultiple(path, ContentValidators.job, language);
}

export async function fetchJob(slug: string, language = 'fr') {
  const path = `jobs/${language}`;
  return genericFetcher.fetchSingle(
    path,
    slug,
    ContentValidators.job,
    language,
  );
}

export async function fetchChallenge(slug: string, language = 'fr') {
  const path = `challenges/${language}`;
  return genericFetcher.fetchSingle(
    path,
    slug,
    ContentValidators.challenge,
    language,
  );
}

export async function fetchChallenges(language = 'fr') {
  const path = `challenges/${language}`;
  return genericFetcher.fetchMultiple(
    path,
    ContentValidators.challenge,
    language,
  );
}

/** File states that stay the same on a retry: the file is skipped. */
const PERMANENT_FILE_STATES = new Set<string>([
  'validation_error',
  'not_found',
  'ignored',
]);

/**
 * Every challenge of a language that loads. Unlike `fetchChallenges`, a file
 * with invalid frontmatter is logged and skipped, so one bad file does not
 * hide the others. A file that fails for another reason (timeout, rate
 * limit, server error) fails the whole list: a partial list would otherwise
 * be cached as complete.
 *
 * Files are fetched one by one, so the filesystem source (local dev) lists a
 * file marked `ignore: true`; the GitHub source skips it.
 */
export async function fetchValidChallenges(
  language = 'fr',
): Promise<ContentResult<MarkdocFile<ChallengeFrontmatter>[]>> {
  const [status, state, items] = await genericFetcher.fetchMetadata(
    `challenges/${language}`,
  );
  if (status !== 200 || !items) {
    return [status, state, undefined];
  }

  const results = await Promise.all(
    items.map(({ slug }) => fetchChallenge(slug, language)),
  );
  const transient = results.find(
    ([fileStatus, fileState]) =>
      fileStatus !== 200 && !PERMANENT_FILE_STATES.has(fileState),
  );
  if (transient) {
    return [transient[0], transient[1], undefined];
  }

  const challenges = results.flatMap(([fileStatus, fileState, file], i) => {
    if (fileStatus === 200 && file) {
      return [file];
    }
    if (fileState !== 'ignored') {
      console.error(
        `[challenges] skipped ${language}/${items[i].slug}:`,
        fileStatus,
        fileState,
      );
    }
    return [];
  });
  return [200, 'success', challenges];
}

/**
 * Generic fetch functions for custom content types
 */
export async function fetchContent<T>(
  path: string,
  slug: string,
  validator: ContentValidator<T>,
  locale?: string,
): Promise<ContentResult<MarkdocFile<T>>> {
  return genericFetcher.fetchSingle(path, slug, validator, locale);
}

export async function fetchContents<T>(
  path: string,
  validator: ContentValidator<T>,
  locale?: string,
): Promise<ContentResult<MarkdocFile<T>[]>> {
  return genericFetcher.fetchMultiple(path, validator, locale);
}
