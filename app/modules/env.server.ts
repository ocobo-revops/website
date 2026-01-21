import untildify from 'untildify';

import { ConfigurationError } from './errors';
import type { PrivateEnvVars, PublicEnvVars } from './types';

/**
 * Get environment variables that are safe to expose to the client
 * These variables can be included in the browser bundle
 */
export function getPublicEnvVars(): PublicEnvVars {
  const env =
    process.env.NODE_ENV === 'production' ? 'production' : 'development';
  return {
    env,
  };
}

// In development, fetch content from local filesystem by default
// Can be overridden with CONTENT_SOURCE environment variable
const DEV_FETCH_FROM = process.env.CONTENT_SOURCE || 'locale';

/**
 * Get all environment variables including sensitive server-only values
 * These variables should never be exposed to the client
 */
export function getPrivateEnvVars(): PrivateEnvVars {
  try {
    // Validate required GitHub environment variables
    const githubAccount = process.env.GITHUB_ACCOUNT;
    const githubRepo = process.env.GITHUB_REPO;
    const githubAccessToken = process.env.GITHUB_ACCESS_TOKEN;
    const githubBranch = process.env.GITHUB_BRANCH || 'main';

    if (!githubAccount || typeof githubAccount !== 'string') {
      throw new ConfigurationError(
        'GITHUB_ACCOUNT environment variable is required',
        'GITHUB_ACCOUNT',
      );
    }

    if (!githubRepo || typeof githubRepo !== 'string') {
      throw new ConfigurationError(
        'GITHUB_REPO environment variable is required',
        'GITHUB_REPO',
      );
    }

    if (!githubAccessToken || typeof githubAccessToken !== 'string') {
      throw new ConfigurationError(
        'GITHUB_ACCESS_TOKEN environment variable is required for content fetching',
        'GITHUB_ACCESS_TOKEN',
      );
    }

    const githubRepoAPIUrl = `https://api.github.com/repos/${githubAccount}/${githubRepo}/contents`;
    const localeRepoAPIUrl = untildify(`~/projects/ocobo/${githubRepo}`);

    const readContentFrom: 'locale' | 'github' =
      process.env.NODE_ENV === 'production'
        ? 'github'
        : (DEV_FETCH_FROM as 'locale' | 'github');

    return {
      ...getPublicEnvVars(),
      githubAccessToken,
      githubBranch,
      githubRepoAPIUrl,
      readContentFrom,
      localeRepoAPIUrl,
    };
  } catch (error) {
    if (error instanceof ConfigurationError) {
      throw error;
    }

    throw new ConfigurationError(
      'Failed to initialize environment configuration',
      undefined,
      { originalError: error },
    );
  }
}
