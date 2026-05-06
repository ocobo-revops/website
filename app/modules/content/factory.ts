/**
 * Content source factory and configuration
 *
 * This module provides the factory pattern for creating content sources
 * and manages the configuration for different environments.
 */

import { createMarkdocConfig } from '../config';
import { getPrivateEnvVars } from '../env.server';
import { FilesystemContentSource } from './sources/filesystem';
import { GitHubContentSource } from './sources/github';
import type { ContentSource, ContentSourceConfig } from './types';

/**
 * Factory for creating content sources based on configuration
 */
export class ContentSourceFactory {
  static create(config: ContentSourceConfig, branch?: string): ContentSource {
    switch (config.source) {
      case 'github':
        if (!config.github) {
          throw new Error(
            'GitHub configuration is required when source is "github"',
          );
        }
        return new GitHubContentSource(
          config.github,
          config.markdocConfig,
          branch,
        );

      case 'filesystem':
        if (!config.filesystem) {
          throw new Error(
            'Filesystem configuration is required when source is "filesystem"',
          );
        }
        return new FilesystemContentSource(
          config.filesystem,
          config.markdocConfig,
        );

      default:
        throw new Error(`Unsupported content source: ${config.source}`);
    }
  }
}

/**
 * Creates a content source based on environment configuration
 */
export function createContentSource(): ContentSource {
  const {
    readContentFrom,
    localeRepoAPIUrl,
    githubRepoAPIUrl,
    githubAccessToken,
    githubBranch,
  } = getPrivateEnvVars();

  // Log content source for debugging
  console.info(
    `🔗 Content Source: ${readContentFrom === 'github' ? 'GitHub API' : 'Local Filesystem'}`,
  );

  switch (readContentFrom) {
    case 'github':
      console.info(
        `📡 Using GitHub API: ${githubRepoAPIUrl} (branch: ${githubBranch})`,
      );
      return ContentSourceFactory.create(
        {
          source: 'github',
          github: {
            accessToken: githubAccessToken,
            baseUrl: githubRepoAPIUrl,
            timeout: 5000,
            batchSize: 10,
          },
          markdocConfig: createMarkdocConfig,
        },
        githubBranch,
      );

    default:
    case 'locale':
      console.info(`📁 Using Local Filesystem: ${localeRepoAPIUrl}`);
      return ContentSourceFactory.create({
        source: 'filesystem',
        filesystem: {
          basePath: localeRepoAPIUrl,
        },
        markdocConfig: createMarkdocConfig,
      });
  }
}

/**
 * Global content source instance (singleton pattern)
 */
let globalContentSource: ContentSource | null = null;

/**
 * Gets or creates the global content source instance
 */
export function getContentSource(): ContentSource {
  if (!globalContentSource) {
    globalContentSource = createContentSource();
  }
  return globalContentSource;
}

/**
 * Resets the global content source (useful for testing)
 */
export function resetContentSource(): void {
  globalContentSource = null;
}
