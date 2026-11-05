import { describe, expect, it } from 'vitest';

import { getLang, getLangParam } from './lang';

function catchThrown(fn: () => unknown): unknown {
  try {
    fn();
  } catch (thrown) {
    return thrown;
  }
  throw new Error('expected a throw');
}

describe('getLangParam', () => {
  it('returns the default language when the ($lang) segment is absent', () => {
    expect(getLangParam({})).toBe('fr');
  });

  it('returns the segment as is, supported or not', () => {
    expect(getLangParam({ lang: 'en' })).toBe('en');
    expect(getLangParam({ lang: 'de' })).toBe('de');
  });
});

describe('getLang', () => {
  it('resolves a path without prefix to French', () => {
    expect(getLang({})).toBe('fr');
  });

  it('resolves each supported prefix to its language', () => {
    expect(getLang({ lang: 'fr' })).toBe('fr');
    expect(getLang({ lang: 'en' })).toBe('en');
  });

  it('throws a 404 Response for an unknown prefix', () => {
    const thrown = catchThrown(() => getLang({ lang: 'de' }));

    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(404);
    expect((thrown as Response).statusText).toBe(
      'Not Found: Invalid language de',
    );
  });

  it('is case sensitive: an upper-case prefix is unknown', () => {
    const thrown = catchThrown(() => getLang({ lang: 'EN' }));

    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(404);
  });
});
