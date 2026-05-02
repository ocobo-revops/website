import Markdoc from '@markdoc/markdoc';
import { describe, expect, it } from 'vitest';

import { config } from '~/modules/config';

import { extractJobSections } from './job-sections';

function parseAndTransform(markdown: string) {
  const ast = Markdoc.parse(markdown);
  return Markdoc.transform(ast, config);
}

const VALID_FIXTURE = `
### Mission {% #mission %}

La mission principale du poste.

#### 1. Sous-section opérationnelle

- Bullet 1
- Bullet 2

### Compétences recherchées {% #competences %}

- Bac+4/5
- 3 à 5 ans d'expérience

### Pourquoi nous rejoindre {% #pourquoi %}

#### Ce que nous valorisons

- Esprit d'équipe
- Impact mesurable
`;

describe('extractJobSections', () => {
  it('should extract the three required sections from a valid document', () => {
    const content = parseAndTransform(VALID_FIXTURE);
    const sections = extractJobSections(content);

    expect(sections.mission).toBeDefined();
    expect(sections.competences).toBeDefined();
    expect(sections.pourquoi).toBeDefined();
    expect(sections.mission.length).toBeGreaterThan(0);
    expect(sections.competences.length).toBeGreaterThan(0);
    expect(sections.pourquoi.length).toBeGreaterThan(0);
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
    const { mission, competences } = extractJobSections(content);

    // mission should not contain a heading with id="competences"
    const leakedHeading = mission.find(
      (node) =>
        node instanceof Tag &&
        node.name === 'Heading' &&
        node.attributes.id === 'competences',
    );
    expect(leakedHeading).toBeUndefined();

    // competences first node should be the competences h3
    const compHeading = competences[0];
    expect(compHeading).toBeInstanceOf(Tag);
    if (compHeading instanceof Tag) {
      expect(compHeading.attributes.id).toBe('competences');
    }
  });

  it('should throw when a required section is missing', () => {
    const missingSection = `
### Mission {% #mission %}

Contenu mission.

### Pourquoi nous rejoindre {% #pourquoi %}

Contenu pourquoi.
`;
    const content = parseAndTransform(missingSection);
    expect(() => extractJobSections(content)).toThrow(/competences/);
  });

  it('should handle extra h4 sub-sections inside a section without splitting', () => {
    const content = parseAndTransform(VALID_FIXTURE);
    const { mission } = extractJobSections(content);

    const { Tag } = Markdoc;
    const h4Nodes = mission.filter(
      (node) =>
        node instanceof Tag &&
        node.name === 'Heading' &&
        node.attributes.level === 4,
    );
    expect(h4Nodes.length).toBeGreaterThan(0);
  });
});
