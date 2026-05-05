/**
 * Generic content fetching types and interfaces
 *
 * This module provides unified types for content fetching across different sources
 * (GitHub API, filesystem) and operations (single file, multiple files).
 */

import type { Config } from '@markdoc/markdoc';
import type { z } from 'zod';
import type { ActionResult, MarkdocFile } from '~/types';

/**
 * Unified states for content fetching operations
 */
export type ContentFetchState =
  | 'success'
  | 'not_found'
  | 'validation_error'
  | 'source_error'
  | 'ignored';

/**
 * Generic content fetch result
 */
export type ContentResult<T> = ActionResult<ContentFetchState, T>;

/**
 * Enhanced validator interface that supports both type guards and Zod schemas
 */
export interface ContentValidator<T> {
  /** Type guard function for backward compatibility */
  isValid: (data: unknown) => data is T;
  /** Zod schema for detailed validation */
  schema: z.ZodSchema<T>;
  /** Content type name for logging/debugging */
  typeName: string;
}

/**
 * Configuration for different content sources
 */
export interface ContentSourceConfig {
  source: 'github' | 'filesystem';
  github?: {
    accessToken: string;
    baseUrl: string;
    timeout?: number;
    batchSize?: number;
  };
  filesystem?: {
    basePath: string;
  };
  markdocConfig: (locale: string) => Config;
}

/**
 * Metadata about a content item (used for batch operations)
 */
export interface ContentItemMetadata {
  slug: string;
  name: string;
  path: string;
}

/**
 * Generic content source interface
 */
export interface ContentSource {
  /**
   * Fetch a single content file
   */
  fetchSingle<T>(
    path: string,
    slug: string,
    validator: ContentValidator<T>,
    locale?: string,
  ): Promise<ContentResult<MarkdocFile<T>>>;

  /**
   * Fetch multiple content files from a directory/collection
   */
  fetchMultiple<T>(
    path: string,
    validator: ContentValidator<T>,
    locale?: string,
  ): Promise<ContentResult<MarkdocFile<T>[]>>;

  /**
   * Get metadata about available content items (optional, for optimization)
   */
  fetchMetadata?(path: string): Promise<ContentResult<ContentItemMetadata[]>>;
}

/**
 * Options for content processing pipeline
 */
export interface ContentProcessingOptions {
  /** Allow files with 'ignore: true' to be skipped */
  respectIgnoreFlag?: boolean;
  /** Continue processing other files if one fails (for batch operations) */
  continueOnError?: boolean;
  /** Custom error context for better debugging */
  context?: string;
}

/**
 * Result of content processing pipeline
 */
export interface ProcessingResult<T> {
  success: boolean;
  data?: MarkdocFile<T>;
  error?: string;
  ignored?: boolean;
}

/**
 * Configuration for specific content types
 */
export interface ContentTypeConfig<T> {
  name: string;
  validator: ContentValidator<T>;
  cacheTTL?: number;
  processingOptions?: ContentProcessingOptions;
}
