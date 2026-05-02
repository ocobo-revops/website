import { describe, expect, it } from 'vitest';
import { parseContactsYaml, resolveContact } from './contacts';

const validYaml = `
aude:
  name: Aude Cadiot
  role: Co-fondatrice
  photo: aude-cadiot.jpg
  shortBio: Référence française du Revenue Operations.
benjamin:
  name: Benjamin Boileux
  role: Co-fondateur
  photo: benjamin-boileux.jpeg
`;

describe('parseContactsYaml', () => {
  it('should parse valid YAML into a ContactsRecord', () => {
    const registry = parseContactsYaml(validYaml);
    expect(registry['aude']).toBeDefined();
    expect(registry['aude'].name).toBe('Aude Cadiot');
    expect(registry['aude'].role).toBe('Co-fondatrice');
    expect(registry['benjamin']).toBeDefined();
  });

  it('should throw on invalid YAML syntax', () => {
    const brokenYaml = `aude:\n  name: [unclosed`;
    expect(() => parseContactsYaml(brokenYaml)).toThrow();
  });

  it('should throw when a contact is missing required fields', () => {
    const missingName = `aude:\n  role: Co-fondatrice\n  photo: aude.jpg`;
    expect(() => parseContactsYaml(missingName)).toThrow();
  });
});

describe('resolveContact', () => {
  it('should return the contact for a known ref', () => {
    const registry = parseContactsYaml(validYaml);
    const contact = resolveContact('aude', registry);
    expect(contact).not.toBeNull();
    expect(contact?.name).toBe('Aude Cadiot');
  });

  it('should return null for an unknown ref', () => {
    const registry = parseContactsYaml(validYaml);
    const contact = resolveContact('unknown-person', registry);
    expect(contact).toBeNull();
  });
});
