// @vitest-environment node

import { afterEach, describe, expect, it, vi } from 'vitest';

import { dropReporter, hasPlaceholder, writtenOrNull } from './placeholder';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('hasPlaceholder', () => {
  it.each([
    '[X]',
    '[]',
    '[Nom du client] : [le passage en une phrase].',
    'Et vos ERP. [Bloc à valider avec Qobra]',
  ])('flags %j', (value) => {
    expect(hasPlaceholder(value)).toBe(true);
  });

  it.each(['+32%', 'a [b', 'b] a [', ''])('keeps %j', (value) => {
    expect(hasPlaceholder(value)).toBe(false);
  });
});

describe('writtenOrNull', () => {
  it('keeps a written value without reporting', () => {
    const onPlaceholder = vi.fn();
    expect(writtenOrNull('Written', onPlaceholder)).toBe('Written');
    expect(onPlaceholder).not.toHaveBeenCalled();
  });

  it('drops a missing value without reporting', () => {
    const onPlaceholder = vi.fn();
    expect(writtenOrNull(undefined, onPlaceholder)).toBeNull();
    expect(onPlaceholder).not.toHaveBeenCalled();
  });

  it('drops and reports a placeholder', () => {
    const onPlaceholder = vi.fn();
    expect(writtenOrNull('[X]', onPlaceholder)).toBeNull();
    expect(onPlaceholder).toHaveBeenCalledOnce();
  });
});

describe('dropReporter', () => {
  it('warns with the scope, the slug, the field and the reason', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const report = dropReporter('ChallengeReferences', 'revenue-ai');

    report('case.headline');
    report('case', 'no headline');

    expect(warn).toHaveBeenNthCalledWith(
      1,
      '[ChallengeReferences] revenue-ai: case.headline dropped (placeholder)',
    );
    expect(warn).toHaveBeenNthCalledWith(
      2,
      '[ChallengeReferences] revenue-ai: case dropped (no headline)',
    );
  });
});
