import { describe, expect, it } from 'vitest';

import { applyFrenchTypography } from './typography';

const NBSP = ' ';

describe('applyFrenchTypography', () => {
  describe('double punctuation', () => {
    it.each([
      ['exclamation', 'Bonjour !', `Bonjour${NBSP}!`],
      ['question', 'Vraiment ?', `Vraiment${NBSP}?`],
      ['colon', 'Note : ceci', `Note${NBSP}: ceci`],
      ['semicolon', 'A ; B', `A${NBSP}; B`],
    ])('inserts NBSP before %s', (_label, input, expected) => {
      expect(applyFrenchTypography(input)).toBe(expected);
    });

    it('handles multiple double-punctuation marks in the same string', () => {
      expect(applyFrenchTypography('Salut ! Comment ça va ?')).toBe(
        `Salut${NBSP}! Comment ça va${NBSP}?`,
      );
    });
  });

  describe('guillemets', () => {
    it('inserts NBSP after an opening guillemet', () => {
      expect(applyFrenchTypography('Il a dit « bonjour »')).toBe(
        `Il a dit «${NBSP}bonjour${NBSP}»`,
      );
    });

    it('handles guillemets nested with other punctuation', () => {
      expect(applyFrenchTypography('« Vraiment ? » dit-il')).toBe(
        `«${NBSP}Vraiment${NBSP}?${NBSP}» dit-il`,
      );
    });
  });

  describe('idempotency', () => {
    it('does not re-process already-correct strings', () => {
      const input = `Bonjour${NBSP}! «${NBSP}quoi${NBSP}?${NBSP}»`;
      expect(applyFrenchTypography(input)).toBe(input);
    });

    it('produces the same result whether run once or twice', () => {
      const raw = 'Salut ! « Ça va ? »';
      const once = applyFrenchTypography(raw);
      const twice = applyFrenchTypography(once);
      expect(twice).toBe(once);
    });
  });

  describe('placeholder preservation', () => {
    it('does not break {{variable}} interpolation', () => {
      expect(applyFrenchTypography('Bonjour {{name}} !')).toBe(
        `Bonjour {{name}}${NBSP}!`,
      );
    });

    it('preserves placeholders adjacent to guillemets', () => {
      expect(applyFrenchTypography('« {{quote}} »')).toBe(
        `«${NBSP}{{quote}}${NBSP}»`,
      );
    });
  });

  describe('edge cases', () => {
    it('returns empty string unchanged', () => {
      expect(applyFrenchTypography('')).toBe('');
    });

    it('leaves strings without targeted punctuation untouched', () => {
      const input = 'Just a regular sentence with a comma, that is all.';
      expect(applyFrenchTypography(input)).toBe(input);
    });

    it('does not insert space when punctuation has no preceding space', () => {
      expect(applyFrenchTypography('https://example.com')).toBe(
        'https://example.com',
      );
    });

    it('does not insert NBSP when the string starts with double punctuation', () => {
      expect(applyFrenchTypography('! Attention')).toBe('! Attention');
    });

    it('handles English text as a no-op when no targeted punctuation present', () => {
      const input = 'Hello world, how are you today.';
      expect(applyFrenchTypography(input)).toBe(input);
    });
  });
});
