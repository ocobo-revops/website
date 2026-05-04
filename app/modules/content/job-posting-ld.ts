import type { JobFrontmatter } from '~/modules/schemas';

const EMPLOYMENT_TYPE: Record<JobFrontmatter['contractType'], string> = {
  CDI: 'FULL_TIME',
  CDD: 'CONTRACTOR',
  Stage: 'INTERN',
  Alternance: 'OTHER',
};

const VALID_THROUGH_DAYS = 90;

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86_400_000);
}

// Escapes </script> sequences to prevent JSON-LD from breaking out of a
// <script> block when injected via dangerouslySetInnerHTML.
export function serializeJsonLd(ld: Record<string, unknown>): string {
  return JSON.stringify(ld).replace(/</g, '\\u003c');
}

export function buildJobPostingLd(
  frontmatter: JobFrontmatter,
  origin: string,
  slug: string,
  lang: string,
): Record<string, unknown> {
  const datePosted = new Date(frontmatter.publishedAt);
  const validThrough = addDays(datePosted, VALID_THROUGH_DAYS).toISOString();

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: frontmatter.title,
    description: frontmatter.intro,
    employmentType: EMPLOYMENT_TYPE[frontmatter.contractType],
    datePosted: datePosted.toISOString(),
    validThrough,
    url: `${origin}/${lang}/jobs/${slug}`,
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Ocobo',
      sameAs: origin,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: frontmatter.location,
        addressCountry: 'FR',
      },
    },
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'France',
    },
    applicationContact: {
      '@type': 'ContactPoint',
      email: frontmatter.applyEmail,
      contactType: 'HR',
    },
  };
}
