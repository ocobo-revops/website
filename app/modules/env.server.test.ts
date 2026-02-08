/**
 * Tests for environment configuration validation
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getPrivateEnvVars, getPublicEnvVars } from './env.server';
import { ConfigurationError } from './errors';

// Mock untildify
vi.mock('untildify', () => ({
  default: (path: string) => path.replace('~', '/home/user'),
}));

describe('Environment Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment variables
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getPublicEnvVars', () => {
    it('should return development environment by default', () => {
      process.env.NODE_ENV = 'development';
      const result = getPublicEnvVars();

      expect(result).toEqual({
        env: 'development',
      });
    });

    it('should return production environment when NODE_ENV is production', () => {
      process.env.NODE_ENV = 'production';
      const result = getPublicEnvVars();

      expect(result).toEqual({
        env: 'production',
      });
    });

    it('should default to development when NODE_ENV is not set', () => {
      delete process.env.NODE_ENV;
      const result = getPublicEnvVars();

      expect(result).toEqual({
        env: 'development',
      });
    });

    it('should default to development for unknown NODE_ENV values', () => {
      process.env.NODE_ENV = 'staging';
      const result = getPublicEnvVars();

      expect(result).toEqual({
        env: 'development',
      });
    });
  });

  describe('getPrivateEnvVars', () => {
    const validEnv = {
      NODE_ENV: 'development',
      GITHUB_ACCOUNT: 'test-account',
      GITHUB_REPO: 'test-repo',
      GITHUB_ACCESS_TOKEN: 'test-token-123',
    };

    beforeEach(() => {
      Object.assign(process.env, validEnv);
    });

    it('should return complete configuration with valid environment variables', () => {
      const result = getPrivateEnvVars();

      expect(result).toEqual({
        env: 'development',
        githubAccessToken: 'test-token-123',
        githubBranch: 'main',
        githubRepoAPIUrl:
          'https://api.github.com/repos/test-account/test-repo/contents',
        readContentFrom: 'locale',
        localeRepoAPIUrl: '/home/user/projects/ocobo/test-repo',
      });
    });

    it('should use github content source in production', () => {
      process.env.NODE_ENV = 'production';
      const result = getPrivateEnvVars();

      expect(result.readContentFrom).toBe('github');
    });

    it('should use locale content source in development', () => {
      process.env.NODE_ENV = 'development';
      const result = getPrivateEnvVars();

      expect(result.readContentFrom).toBe('locale');
    });

    describe('Validation Errors', () => {
      it('should throw ConfigurationError when GITHUB_ACCOUNT is missing', () => {
        delete process.env.GITHUB_ACCOUNT;

        expect(() => getPrivateEnvVars()).toThrow(ConfigurationError);
        expect(() => getPrivateEnvVars()).toThrow(
          'GITHUB_ACCOUNT environment variable is required',
        );

        try {
          getPrivateEnvVars();
        } catch (error) {
          expect((error as ConfigurationError).configKey).toBe(
            'GITHUB_ACCOUNT',
          );
          expect((error as ConfigurationError).code).toBe(
            'CONFIGURATION_ERROR',
          );
        }
      });

      it('should throw ConfigurationError when GITHUB_ACCOUNT is empty string', () => {
        process.env.GITHUB_ACCOUNT = '';

        expect(() => getPrivateEnvVars()).toThrow(ConfigurationError);
        expect(() => getPrivateEnvVars()).toThrow(
          'GITHUB_ACCOUNT environment variable is required',
        );
      });

      it('should throw ConfigurationError when GITHUB_REPO is missing', () => {
        delete process.env.GITHUB_REPO;

        expect(() => getPrivateEnvVars()).toThrow(ConfigurationError);
        expect(() => getPrivateEnvVars()).toThrow(
          'GITHUB_REPO environment variable is required',
        );

        try {
          getPrivateEnvVars();
        } catch (error) {
          expect((error as ConfigurationError).configKey).toBe('GITHUB_REPO');
        }
      });

      it('should throw ConfigurationError when GITHUB_REPO is empty string', () => {
        process.env.GITHUB_REPO = '';

        expect(() => getPrivateEnvVars()).toThrow(ConfigurationError);
      });

      it('should throw ConfigurationError when GITHUB_ACCESS_TOKEN is missing', () => {
        delete process.env.GITHUB_ACCESS_TOKEN;

        expect(() => getPrivateEnvVars()).toThrow(ConfigurationError);
        expect(() => getPrivateEnvVars()).toThrow(
          'GITHUB_ACCESS_TOKEN environment variable is required for content fetching',
        );

        try {
          getPrivateEnvVars();
        } catch (error) {
          expect((error as ConfigurationError).configKey).toBe(
            'GITHUB_ACCESS_TOKEN',
          );
        }
      });

      it('should throw ConfigurationError when GITHUB_ACCESS_TOKEN is empty string', () => {
        process.env.GITHUB_ACCESS_TOKEN = '';

        expect(() => getPrivateEnvVars()).toThrow(ConfigurationError);
      });

      it('should throw ConfigurationError when environment variables are not strings', () => {
        // TypeScript won't allow this, but JavaScript runtime could have these values
        (process.env as any).GITHUB_ACCOUNT = 123;

        expect(() => getPrivateEnvVars()).toThrow(ConfigurationError);
      });
    });

    describe('URL Construction', () => {
      it('should construct correct GitHub API URL', () => {
        process.env.GITHUB_ACCOUNT = 'my-org';
        process.env.GITHUB_REPO = 'my-repo';

        const result = getPrivateEnvVars();

        expect(result.githubRepoAPIUrl).toBe(
          'https://api.github.com/repos/my-org/my-repo/contents',
        );
      });

      it('should construct correct local repository URL', () => {
        process.env.GITHUB_REPO = 'my-project';

        const result = getPrivateEnvVars();

        expect(result.localeRepoAPIUrl).toBe(
          '/home/user/projects/ocobo/my-project',
        );
      });

      it('should handle special characters in repository names', () => {
        process.env.GITHUB_ACCOUNT = 'user-name';
        process.env.GITHUB_REPO = 'repo_name.test';

        const result = getPrivateEnvVars();

        expect(result.githubRepoAPIUrl).toBe(
          'https://api.github.com/repos/user-name/repo_name.test/contents',
        );
      });
    });

    describe('Error Handling and Context', () => {
      it('should have proper error handling structure', () => {
        // Test that the function exists and basic validation works
        delete process.env.GITHUB_ACCOUNT;

        expect(() => getPrivateEnvVars()).toThrow(ConfigurationError);

        // Restore for other tests
        process.env.GITHUB_ACCOUNT = 'test-account';
      });

      it('should preserve original ConfigurationError when re-thrown', () => {
        delete process.env.GITHUB_ACCOUNT;

        try {
          getPrivateEnvVars();
        } catch (error) {
          expect(error).toBeInstanceOf(ConfigurationError);
          expect((error as ConfigurationError).configKey).toBe(
            'GITHUB_ACCOUNT',
          );
          expect((error as ConfigurationError).message).toBe(
            'GITHUB_ACCOUNT environment variable is required',
          );
        }
      });
    });

    describe('Integration with Public Vars', () => {
      it('should include public environment variables', () => {
        process.env.NODE_ENV = 'production';

        const result = getPrivateEnvVars();

        expect(result.env).toBe('production');
      });

      it('should merge public and private configurations correctly', () => {
        const result = getPrivateEnvVars();

        // Should have both public and private properties
        expect(result).toHaveProperty('env');
        expect(result).toHaveProperty('githubAccessToken');
        expect(result).toHaveProperty('githubBranch');
        expect(result).toHaveProperty('githubRepoAPIUrl');
        expect(result).toHaveProperty('readContentFrom');
        expect(result).toHaveProperty('localeRepoAPIUrl');
      });
    });
  });
});
