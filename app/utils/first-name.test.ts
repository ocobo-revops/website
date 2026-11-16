import { describe, expect, it } from 'vitest';

import { getFirstName } from './first-name';

describe('getFirstName', () => {
  it('returns the first word of a full name', () => {
    expect(getFirstName('Clara Lecarrié')).toBe('Clara');
  });

  it('ignores leading and repeated spaces', () => {
    expect(getFirstName('  Aude   Cadiot ')).toBe('Aude');
  });

  it('returns an empty string for a blank name', () => {
    expect(getFirstName('   ')).toBe('');
  });
});
