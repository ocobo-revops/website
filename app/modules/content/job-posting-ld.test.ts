import { describe, expect, it } from 'vitest';

import type { JobFrontmatter } from '~/modules/schemas';

import { buildJobPostingLd, serializeJsonLd } from './job-posting-ld';

const BASE_FRONTMATTER: JobFrontmatter = {
  title: 'Revenue Operations Manager',
  icon: 'briefcase',
  contractType: 'CDI',
  seniority: 'Senior',
  location: 'Paris',
  hiringContact: 'aude-cadiot',
  applyEmail: 'jobs@ocobo.co',
  status: 'published',
  publishedAt: '2024-01-15',
  intro: 'Rejoignez notre équipe RevOps.',
};

const ORIGIN = 'https://www.ocobo.co';

describe('buildJobPostingLd', () => {
  it('maps contractType to employmentType correctly', () => {
    const cases: Array<[JobFrontmatter['contractType'], string]> = [
      ['CDI', 'FULL_TIME'],
      ['CDD', 'CONTRACTOR'],
      ['Stage', 'INTERN'],
      ['Alternance', 'OTHER'],
    ];

    for (const [contractType, expected] of cases) {
      const result = buildJobPostingLd(
        { ...BASE_FRONTMATTER, contractType },
        ORIGIN,
        'revenue-ops-manager',
        'fr',
      );
      expect(result.employmentType).toBe(expected);
    }
  });

  it('derives validThrough as publishedAt + 90 days', () => {
    const result = buildJobPostingLd(
      BASE_FRONTMATTER,
      ORIGIN,
      'revenue-ops-manager',
      'fr',
    );
    const datePosted = new Date('2024-01-15');
    const expected = new Date(datePosted.getTime() + 90 * 86_400_000);

    expect(result.validThrough).toBe(expected.toISOString());
  });

  it('sets hiringOrganization to Ocobo', () => {
    const result = buildJobPostingLd(
      BASE_FRONTMATTER,
      ORIGIN,
      'revenue-ops-manager',
      'fr',
    );
    expect(
      (result.hiringOrganization as Record<string, unknown>)['@type'],
    ).toBe('Organization');
    expect((result.hiringOrganization as Record<string, unknown>).name).toBe(
      'Ocobo',
    );
  });

  it('sets jobLocation with addressLocality from frontmatter', () => {
    const result = buildJobPostingLd(
      BASE_FRONTMATTER,
      ORIGIN,
      'revenue-ops-manager',
      'fr',
    );
    const address = (result.jobLocation as Record<string, unknown>)
      .address as Record<string, unknown>;
    expect(address.addressLocality).toBe('Paris');
    expect(address.addressCountry).toBe('FR');
  });

  it('sets applicantLocationRequirements to France', () => {
    const result = buildJobPostingLd(
      BASE_FRONTMATTER,
      ORIGIN,
      'revenue-ops-manager',
      'fr',
    );
    expect(
      (result.applicantLocationRequirements as Record<string, unknown>).name,
    ).toBe('France');
  });

  it('includes applicationContact email from job frontmatter', () => {
    const result = buildJobPostingLd(
      BASE_FRONTMATTER,
      ORIGIN,
      'revenue-ops-manager',
      'fr',
    );
    expect(result.applicationContact).toBeDefined();
    expect((result.applicationContact as Record<string, unknown>).email).toBe(
      'jobs@ocobo.co',
    );
  });

  it('matches snapshot', () => {
    const result = buildJobPostingLd(
      BASE_FRONTMATTER,
      ORIGIN,
      'revenue-ops-manager',
      'fr',
    );
    expect(result).toMatchSnapshot();
  });
});

describe('serializeJsonLd', () => {
  it('escapes </script> to prevent XSS breakout', () => {
    const ld = { title: 'Hack</script><script>alert(1)</script>' };
    const serialized = serializeJsonLd(ld);
    expect(serialized).not.toContain('</script>');
    expect(serialized).toContain('\\u003c/script>');
  });

  it('produces valid JSON', () => {
    const ld = buildJobPostingLd(
      BASE_FRONTMATTER,
      ORIGIN,
      'revenue-ops-manager',
      'fr',
    );
    expect(() => JSON.parse(serializeJsonLd(ld))).not.toThrow();
  });
});
