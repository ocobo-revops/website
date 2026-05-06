/**
 * Filesystem content source implementation
 *
 * This module provides content fetching from the local filesystem,
 * replacing the individual fs/fetchMarkdownFile(s).server.ts files.
 */

import type { Config } from '@markdoc/markdoc';
import fs from 'fs/promises';
import type { MarkdocFile } from '~/types';

import { FileSystemError } from '../../errors';
import {
  constructFilePath,
  normalizeSlug,
  processMarkdownContent,
} from '../processor';
import type {
  ContentItemMetadata,
  ContentResult,
  ContentSource,
  ContentSourceConfig,
  ContentValidator,
} from '../types';

export class FilesystemContentSource implements ContentSource {
  constructor(
    private config: NonNullable<ContentSourceConfig['filesystem']>,
    private markdocConfigFactory: (locale: string) => Config,
  ) {}

  async fetchSingle<T>(
    path: string,
    slug: string,
    validator: ContentValidator<T>,
    locale: string = 'fr',
  ): Promise<ContentResult<MarkdocFile<T>>> {
    const fullPath = `${this.config.basePath}/${path}`;
    const filePath = constructFilePath(fullPath, slug);

    try {
      const file = await fs.readFile(filePath, 'utf8');
      if (!file) {
        return [404, 'not_found', undefined];
      }

      const result = processMarkdownContent(
        file,
        slug,
        validator,
        this.markdocConfigFactory(locale),
        {
          respectIgnoreFlag: false, // Single file fetch shouldn't respect ignore
          context: `Filesystem:${validator.typeName}`,
        },
      );

      if (!result.success) {
        if (
          result.error?.includes('Invalid') &&
          result.error?.includes('frontmatter')
        ) {
          return [422, 'validation_error', undefined];
        }
        return [500, 'source_error', undefined];
      }

      if (!result.data) {
        return [500, 'source_error', undefined];
      }

      return [200, 'success', result.data];
    } catch (error: unknown) {
      // Handle filesystem errors
      if (
        error instanceof Error &&
        'code' in error &&
        error.code === 'ENOENT'
      ) {
        return [404, 'not_found', undefined];
      }

      const fsError = new FileSystemError(
        `Failed to read file: ${filePath}`,
        'read',
        filePath,
        { originalError: error, slug },
      );
      console.error(fsError.message);
      return [500, 'source_error', undefined];
    }
  }

  async fetchMultiple<T>(
    path: string,
    validator: ContentValidator<T>,
    locale: string = 'fr',
  ): Promise<ContentResult<MarkdocFile<T>[]>> {
    const fullPath = `${this.config.basePath}/${path}`;

    try {
      const entries = await fs.readdir(fullPath, {
        encoding: 'utf8',
        withFileTypes: true,
      });

      if (!entries) {
        return [404, 'not_found', undefined];
      }

      const mdFiles: MarkdocFile<T>[] = [];

      for (const entry of entries) {
        if (!entry.isDirectory() && entry.name.endsWith('.md')) {
          try {
            const file = await fs.readFile(`${fullPath}/${entry.name}`, 'utf8');
            if (!file) {
              console.warn(`Empty file: ${entry.name}`);
              continue;
            }

            const slug = entry.name.replace('.md', '');
            const result = processMarkdownContent(
              file,
              slug,
              validator,
              this.markdocConfigFactory(locale),
              {
                respectIgnoreFlag: true, // Respect ignore flag in batch operations
                context: `Filesystem:${validator.typeName}:Batch`,
              },
            );

            if (result.ignored) {
              continue; // Skip ignored files
            }

            if (!result.success) {
              console.error(`Failed to process ${entry.name}: ${result.error}`);
              // In batch operations, we could choose to continue or fail
              // For now, we'll fail fast to maintain existing behavior
              return [500, 'source_error', undefined];
            }

            if (result.data) {
              mdFiles.push(result.data);
            }
          } catch (error: unknown) {
            console.error(`Error processing file ${entry.name}:`, error);
            return [500, 'source_error', undefined];
          }
        }
      }

      return [200, 'success', mdFiles];
    } catch (error: unknown) {
      const fsError = new FileSystemError(
        `Failed to read directory: ${fullPath}`,
        'list',
        fullPath,
        { originalError: error },
      );
      console.error(fsError.message);
      return [500, 'source_error', undefined];
    }
  }

  async fetchMetadata(
    path: string,
  ): Promise<ContentResult<ContentItemMetadata[]>> {
    const fullPath = `${this.config.basePath}/${path}`;

    try {
      const entries = await fs.readdir(fullPath, {
        encoding: 'utf8',
        withFileTypes: true,
      });

      if (!entries) {
        return [404, 'not_found', undefined];
      }

      const metadata: ContentItemMetadata[] = entries
        .filter((entry) => !entry.isDirectory() && entry.name.endsWith('.md'))
        .map((entry) => ({
          slug: normalizeSlug(entry.name),
          name: entry.name,
          path: `${path}/${entry.name}`,
        }));

      return [200, 'success', metadata];
    } catch (error: unknown) {
      const fsError = new FileSystemError(
        `Failed to read directory metadata: ${fullPath}`,
        'list',
        fullPath,
        { originalError: error },
      );
      console.error(fsError.message);
      return [500, 'source_error', undefined];
    }
  }
}
