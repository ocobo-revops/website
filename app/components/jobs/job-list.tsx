import { Link } from 'react-router';

import { css } from '@ocobo/styled-system/css';

import type { JobFrontmatter } from '~/modules/schemas';
import type { MarkdocFile } from '~/types';

type JobListProps = {
  jobs: MarkdocFile<JobFrontmatter>[];
};

export function JobList({ jobs }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className={css({ p: '8', textAlign: 'center' })}>
        Aucune offre disponible pour le moment.
      </div>
    );
  }

  return (
    <ul className={css({ listStyle: 'none', p: '0', m: '0' })}>
      {jobs.map((job) => (
        <li key={job.slug}>
          <Link to={`/jobs/${job.slug}`}>
            <span>{job.frontmatter.icon}</span>
            <span>{job.frontmatter.title}</span>
            <span>{job.frontmatter.contractType}</span>
            <span>{job.frontmatter.location}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
