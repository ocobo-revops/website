import type { HiringContact, JobFrontmatter } from '~/modules/schemas';

const EMPLOYMENT_TYPE: Record<JobFrontmatter['contractType'], string> = {
  CDI: 'FULL_TIME',
  CDD: 'CONTRACTOR',
  Stage: 'INTERN',
  Alternance: 'OTHER',
};

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function buildJobPostingLd(
  frontmatter: JobFrontmatter,
  contact: HiringContact | null,
  origin: string,
  slug: string,
  lang: string,
): Record<string, unknown> {
  const datePosted = new Date(frontmatter.publishedAt);
  const validThrough = addDays(datePosted, 90).toISOString();

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
    ...(contact?.applyEmail && {
      applicationContact: {
        '@type': 'ContactPoint',
        email: contact.applyEmail,
        contactType: 'HR',
      },
    }),
  };
}
