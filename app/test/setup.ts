/**
 * Vitest test setup file
 * This file runs before all test files and sets up global test environment
 */

import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { toHaveNoViolations } from 'jest-axe';
import { afterAll, afterEach, beforeAll, beforeEach, expect, vi } from 'vitest';

import { server } from './msw/server';

expect.extend(toHaveNoViolations);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

beforeEach(() => {
  vi.clearAllMocks();

  process.env.NODE_ENV = 'test';
  process.env.GITHUB_ACCOUNT = 'test-account';
  process.env.GITHUB_REPO = 'test-repo';
  process.env.GITHUB_ACCESS_TOKEN = 'test-token';
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

(global as any).mockConsole = () => {
  const originalConsole = { ...console };

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {
      // suppress noise in tests
    });
    vi.spyOn(console, 'error').mockImplementation(() => {
      // suppress noise in tests
    });
    vi.spyOn(console, 'warn').mockImplementation(() => {
      // suppress noise in tests
    });
    vi.spyOn(console, 'debug').mockImplementation(() => {
      // suppress noise in tests
    });
  });

  return originalConsole;
};
