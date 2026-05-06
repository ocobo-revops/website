/**
 * GitHub API content source implementation
 *
 * This module provides content fetching from GitHub repositories,
 * replacing the individual github/fetchMarkdownFile(s).server.ts files.
 */

import type { Config } from '@markdoc/markdoc';
import type { MarkdocFile } from '~/types';

import { GitHubAPIError, toContentError } from '../../errors';
import {
  constructFilePath,
  mapStatusToState,
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

export class GitHubContentSource implements ContentSource {
  private config: NonNullable<ContentSourceConfig['github']>;
  private timeout: number;
  private batchSize: number;
  private branch: string;

  constructor(
    config: NonNullable<ContentSourceConfig['github']>,
    private markdocConfigFactory: (locale: string) => Config,
    branch: string = 'main',
  ) {
    this.config = config;
    this.timeout = config.timeout ?? 5000;
    this.batchSize = config.batchSize ?? 10;
    this.branch = branch;
  }

  private getHeaders() {
    return {
      Accept: 'application/vnd.github.v3.raw',
      Authorization: `token ${this.config.accessToken}`,
      'User-Agent': 'ocobo-content-fetcher',
    };
  }

  private async fetchWithTimeout(url: string): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      // Add branch parameter to URL
      const urlWithBranch = new URL(url);
      urlWithBranch.searchParams.set('ref', this.branch);

      const response = await fetch(urlWithBranch.toString(), {
        headers: this.getHeaders(),
        signal: controller.signal,
        cache: 'force-cache',
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new GitHubAPIError('Request timed out', 408, 'Request Timeout', {
          url,
          timeout: this.timeout,
        });
      }
      throw error;
    }
  }

  async fetchSingle<T>(
    path: string,
    slug: string,
    validator: ContentValidator<T>,
    locale: string = 'fr',
  ): Promise<ContentResult<MarkdocFile<T>>> {
    const filePath = constructFilePath(path, slug);
    const contentUrl = `${this.config.baseUrl}/${filePath}`;

    try {
      const response = await this.fetchWithTimeout(contentUrl);

      if (!response.ok || response.status !== 200) {
        const errorMessage = `GitHub API request failed: ${response.status} ${response.statusText}`;
        console.error(errorMessage);

        return [response.status, mapStatusToState(response.status), undefined];
      }

      const markdown = await response.text();
      const result = processMarkdownContent(
        markdown,
        slug,
        validator,
        this.markdocConfigFactory(locale),
        {
          respectIgnoreFlag: true, // GitHub single files should respect ignore
          context: `GitHub:${validator.typeName}`,
        },
      );

      if (result.ignored) {
        return [404, 'ignored', undefined];
      }

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
      const fetchError = toContentError(
        error,
        `Failed to fetch markdown file: ${contentUrl}`,
        { contentUrl },
      );
      console.error('GitHub fetch error:', fetchError.message);
      return [500, 'source_error', undefined];
    }
  }

  async fetchMultiple<T>(
    path: string,
    validator: ContentValidator<T>,
    locale: string = 'fr',
  ): Promise<ContentResult<MarkdocFile<T>[]>> {
    // First, get the list of files
    const [status, state, items] = await this.fetchMetadata(path);

    if (status !== 200 || !items) {
      return [
        status,
        state === 'not_found' ? 'not_found' : 'source_error',
        undefined,
      ];
    }

    // Process files in batches to respect GitHub API rate limits
    const mdFiles: MarkdocFile<T>[] = [];

    for (let i = 0; i < items.length; i += this.batchSize) {
      const batch = items.slice(i, i + this.batchSize);
      const batchPromises = batch.map((item) =>
        this.fetchSingle(path, item.slug, validator, locale),
      );

      const batchResults = await Promise.all(batchPromises);

      for (const [fetchStatus, fetchState, file] of batchResults) {
        if (fetchStatus !== 200 || !file) {
          if (fetchState === 'ignored') {
            continue; // Skip ignored files
          }
          console.error(
            `FetchMarkdownFiles failed with [${fetchStatus}] ${fetchState}.`,
          );
          return [fetchStatus, 'source_error', undefined];
        }
        mdFiles.push(file);
      }
    }

    return [200, 'success', mdFiles];
  }

  async fetchMetadata(
    path: string,
  ): Promise<ContentResult<ContentItemMetadata[]>> {
    try {
      const directoryUrl = `${this.config.baseUrl}/${path}`;
      const response = await this.fetchWithTimeout(directoryUrl);

      if (!response.ok) {
        const errorMessage = `GitHub API directory request failed: ${response.status} ${response.statusText}`;
        console.error(errorMessage);

        return [response.status, mapStatusToState(response.status), undefined];
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error('Expected array from GitHub API, got:', typeof data);
        return [500, 'source_error', undefined];
      }

      const metadata: ContentItemMetadata[] = data
        .filter(
          (item: any) => item.type === 'file' && item.name?.endsWith?.('.md'),
        )
        .map((item: any) => ({
          slug: normalizeSlug(item.name),
          name: item.name,
          path: item.download_url || item.url,
        }));

      return [200, 'success', metadata];
    } catch (error: unknown) {
      const fetchError = toContentError(
        error,
        `Failed to fetch directory metadata: ${path}`,
        { path },
      );
      console.error('GitHub metadata fetch error:', fetchError.message);
      return [500, 'source_error', undefined];
    }
  }
}
