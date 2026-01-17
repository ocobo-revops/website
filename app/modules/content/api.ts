/**
 * Generic content API
 *
 * This module provides the main API for content fetching that integrates
 * with the existing validation system and replaces the individual fetch functions.
 */

import type { MarkdocFile } from '~/types';
import {
  type BlogpostFrontmatter,
  BlogpostFrontmatterSchema,
  type OfferFrontmatter,
  OfferFrontmatterSchema,
  type PageFrontmatter,
  PageFrontmatterSchema,
  type StoryFrontmatter,
  StoryFrontmatterSchema,
} from '../schemas';
import { getContentSource } from './factory';
import { createValidator } from './processor';
import type { ContentResult, ContentValidator } from './types';

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
  offer: createValidator<OfferFrontmatter>(OfferFrontmatterSchema, 'Offer'),
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
  ): Promise<ContentResult<MarkdocFile<T>>> {
    return this.contentSource.fetchSingle(path, slug, validator);
  }

  /**
   * Fetch multiple content files
   */
  async fetchMultiple<T>(
    path: string,
    validator: ContentValidator<T>,
  ): Promise<ContentResult<MarkdocFile<T>[]>> {
    return this.contentSource.fetchMultiple(path, validator);
  }

  /**
   * Fetch content metadata
   */
  async fetchMetadata(path: string) {
    return (
      this.contentSource.fetchMetadata?.(path) ?? [404, 'not_found', undefined]
    );
  }
}

/**
 * Specific content type fetchers for backward compatibility
 */
export class StoryFetcher extends GenericContentFetcher {
  async fetchStory(path: string, slug: string = '') {
    return this.fetchSingle(path, slug, ContentValidators.story);
  }

  async fetchStories(path: string) {
    return this.fetchMultiple(path, ContentValidators.story);
  }
}

export class BlogpostFetcher extends GenericContentFetcher {
  async fetchBlogpost(path: string, slug: string = '') {
    return this.fetchSingle(path, slug, ContentValidators.blogpost);
  }

  async fetchBlogposts(path: string) {
    return this.fetchMultiple(path, ContentValidators.blogpost);
  }
}

export class PageFetcher extends GenericContentFetcher {
  async fetchPage(path: string, slug: string = '') {
    return this.fetchSingle(path, slug, ContentValidators.page);
  }

  async fetchPages(path: string) {
    return this.fetchMultiple(path, ContentValidators.page);
  }
}

export class OfferFetcher extends GenericContentFetcher {
  async fetchOffer(path: string, slug: string = '') {
    return this.fetchSingle(path, slug, ContentValidators.offer);
  }

  async fetchOffers(path: string) {
    return this.fetchMultiple(path, ContentValidators.offer);
  }
}

/**
 * Default instances for immediate use
 */
export const storyFetcher = new StoryFetcher();
export const blogpostFetcher = new BlogpostFetcher();
export const pageFetcher = new PageFetcher();
export const offerFetcher = new OfferFetcher();
export const genericFetcher = new GenericContentFetcher();

/**
 * Simplified convenience functions - direct calls without complex caching
 * Caching is now handled at the HTTP response level in route loaders
 */
export async function fetchStory(slug: string = '', language: string = 'fr') {
  const path = `stories/${language}`;
  return storyFetcher.fetchStory(path, slug);
}

export async function fetchStories(language: string = 'fr') {
  const path = `stories/${language}`;
  return storyFetcher.fetchStories(path);
}

export async function fetchBlogpost(
  slug: string = '',
  language: string = 'fr',
) {
  const path = `blog/${language}`;
  return blogpostFetcher.fetchBlogpost(path, slug);
}

export async function fetchBlogposts(language: string = 'fr') {
  const path = `blog/${language}`;
  return blogpostFetcher.fetchBlogposts(path);
}

export async function fetchPage(path: string, slug: string = '') {
  return pageFetcher.fetchPage(path, slug);
}

export async function fetchPages(path: string) {
  return pageFetcher.fetchPages(path);
}

export async function fetchOffer(slug: string = '', language: string = 'fr') {
  const path = `offers/${language}`;
  return offerFetcher.fetchOffer(path, slug);
}

export async function fetchOffers(language: string = 'fr') {
  const path = `offers/${language}`;
  return offerFetcher.fetchOffers(path);
}

/**
 * Generic fetch functions for custom content types
 */
export async function fetchContent<T>(
  path: string,
  slug: string,
  validator: ContentValidator<T>,
): Promise<ContentResult<MarkdocFile<T>>> {
  return genericFetcher.fetchSingle(path, slug, validator);
}

export async function fetchContents<T>(
  path: string,
  validator: ContentValidator<T>,
): Promise<ContentResult<MarkdocFile<T>[]>> {
  return genericFetcher.fetchMultiple(path, validator);
}
