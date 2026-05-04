import Markdoc from '@markdoc/markdoc';
import { describe, expect, it } from 'vitest';

import { config } from '~/modules/config';

import { extractJobSections } from './job-sections';

function parseAndTransform(markdown: string) {
  const ast = Markdoc.parse(markdown);
  return Markdoc.transform(ast, config);
}

const VALID_FIXTURE = `
### La Mission {% #mission %}

La mission principale du poste.

### Responsabilités {% #responsabilites %}

#### 1. Sous-section opérationnelle

- Bullet 1
- Bullet 2

### Profil recherché {% #profil %}

- Bac+4/5
- 3 à 5 ans d'expérience
`;

describe('extractJobSections', () => {
  it('should extract the three required sections from a valid document', () => {
    const content = parseAndTransform(VALID_FIXTURE);
    const sections = extractJobSections(content);

    expect(sections.mission).toBeDefined();
    expect(sections.responsabilites).toBeDefined();
    expect(sections.profil).toBeDefined();
    expect(sections.mission.length).toBeGreaterThan(0);
    expect(sections.responsabilites.length).toBeGreaterThan(0);
    expect(sections.profil.length).toBeGreaterThan(0);
  });

  it('should include the h3 heading node as the first item in each section', () => {
    const { Tag } = Markdoc;
    const content = parseAndTransform(VALID_FIXTURE);
    const sections = extractJobSections(content);

    const missionHeading = sections.mission[0];
    expect(missionHeading).toBeInstanceOf(Tag);
    if (missionHeading instanceof Tag) {
      expect(missionHeading.name).toBe('Heading');
      expect(missionHeading.attributes.level).toBe(3);
      expect(missionHeading.attributes.id).toBe('mission');
    }
  });

  it('should not bleed content from one section into the next', () => {
    const { Tag } = Markdoc;
    const content = parseAndTransform(VALID_FIXTURE);
    const { mission, responsabilites } = extractJobSections(content);

    const leakedHeading = mission.find(
      (node) =>
        node instanceof Tag &&
        node.name === 'Heading' &&
        node.attributes.id === 'responsabilites',
    );
    expect(leakedHeading).toBeUndefined();

    const respHeading = responsabilites[0];
    expect(respHeading).toBeInstanceOf(Tag);
    if (respHeading instanceof Tag) {
      expect(respHeading.attributes.id).toBe('responsabilites');
    }
  });

  it('should throw when a required section is missing', () => {
    const missingSection = `
### La Mission {% #mission %}

Contenu mission.

### Profil recherché {% #profil %}

Contenu profil.
`;
    const content = parseAndTransform(missingSection);
    expect(() => extractJobSections(content)).toThrow(/responsabilites/);
  });

  it('should handle extra h4 sub-sections inside a section without splitting', () => {
    const content = parseAndTransform(VALID_FIXTURE);
    const { responsabilites } = extractJobSections(content);

    const { Tag } = Markdoc;
    const h4Nodes = responsabilites.filter(
      (node) =>
        node instanceof Tag &&
        node.name === 'Heading' &&
        node.attributes.level === 4,
    );
    expect(h4Nodes.length).toBeGreaterThan(0);
  });
});
