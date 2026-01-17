/**
 * Generic content fetching system
 *
 * This module provides a unified, type-safe content fetching system that
 * replaces the individual fetch functions with a generic, extensible approach.
 *
 * Key features:
 * - Unified interface for GitHub API and filesystem sources
 * - Generic typing system that works with any content type
 * - Integrated validation with Zod schemas
 * - Backward compatibility with existing APIs
 * - Centralized error handling and logging
 * - Configurable processing options
 */

// Main API exports
export {
  GenericContentFetcher,
  StoryFetcher,
  BlogpostFetcher,
  PageFetcher,
  OfferFetcher,
  storyFetcher,
  blogpostFetcher,
  pageFetcher,
  offerFetcher,
  genericFetcher,
  fetchStory,
  fetchStories,
  fetchBlogpost,
  fetchBlogposts,
  fetchPage,
  fetchPages,
  fetchOffer,
  fetchOffers,
  fetchContent,
  fetchContents,
  ContentValidators,
} from './api';

// Factory and configuration exports
export {
  ContentSourceFactory,
  createContentSource,
  getContentSource,
  resetContentSource,
} from './factory';

// Processing utilities exports
export {
  processMarkdownContent,
  normalizeSlug,
  constructFilePath,
  mapStatusToState,
  createValidator,
} from './processor';

// Type exports
export type {
  ContentFetchState,
  ContentResult,
  ContentValidator,
  ContentSource,
  ContentSourceConfig,
  ContentItemMetadata,
  ContentProcessingOptions,
  ProcessingResult,
  ContentTypeConfig,
} from './types';

// Source implementations (mainly for testing and advanced usage)
export { FilesystemContentSource } from './sources/filesystem';
export { GitHubContentSource } from './sources/github';
