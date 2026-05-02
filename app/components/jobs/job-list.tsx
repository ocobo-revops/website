import { ArrowRight, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { center, flex, hstack, vstack } from '@ocobo/styled-system/patterns';

import type { JobFrontmatter } from '~/modules/schemas';
import type { MarkdocFile } from '~/types';

// Pre-computed static classes — Panda CSS requires static literals in css()
const highlightBarClasses = [
  css({ bg: 'ocobo.yellow' }),
  css({ bg: 'ocobo.sky' }),
  css({ bg: 'ocobo.mint' }),
  css({ bg: 'ocobo.coral' }),
];

type JobListProps = {
  jobs: MarkdocFile<JobFrontmatter>[];
};

export function JobList({ jobs }: JobListProps) {
  const { t } = useTranslation('jobs');

  if (jobs.length === 0) {
    return (
      <div className={css({ p: '8', textAlign: 'center', color: 'gray.500' })}>
        {t('list.empty')}
      </div>
    );
  }

  return (
    <section
      className={css({
        maxW: '7xl',
        mx: 'auto',
        px: { base: '4', sm: '6', lg: '8' },
        mb: '40',
      })}
    >
      {/* Section header */}
      <div
        className={`${flex({ justify: 'space-between', align: 'end' })} ${css({ mb: '16' })}`}
      >
        <div>
          <h2
            className={css({
              fontFamily: 'display',
              fontSize: { base: '4xl', md: '5xl' },
              fontWeight: 'black',
              color: 'ocobo.dark',
              letterSpacing: 'tight',
            })}
          >
            {t('jobs.sectionTitle')}
          </h2>
          <p
            className={css({
              color: 'gray.500',
              fontWeight: 'medium',
              mt: '4',
            })}
          >
            {t('jobs.sectionSubtitle')}
          </p>
        </div>
        <div className={css({ display: { base: 'none', md: 'block' } })}>
          <span
            className={css({
              fontSize: 'xs',
              fontWeight: 'black',
              textTransform: 'uppercase',
              letterSpacing: 'widest',
              color: 'gray.300',
            })}
          >
            {t('jobs.opportunitiesCount', { count: jobs.length })}
          </span>
        </div>
      </div>

      {/* Job cards */}
      <ul className={vstack({ gap: '6', alignItems: 'stretch' })}>
        {jobs.map((job, index) => (
          <li key={job.slug}>
            <Link
              to={`/jobs/${job.slug}`}
              className={css({
                display: 'block',
                '& .arrow-box': {
                  transition: 'all',
                  transitionDuration: '500ms',
                },
                '&:hover .arrow-box': {
                  bg: 'ocobo.dark',
                  color: 'white',
                  shadow: 'xl',
                  transform: 'rotate(-12deg)',
                },
                '&:hover .highlight-bar': { opacity: 1 },
                '&:hover h3': { color: 'black' },
              })}
            >
              <div
                className={`${flex({
                  direction: { base: 'column', md: 'row' },
                  justify: 'space-between',
                  align: 'center',
                })} ${css({
                  p: { base: '8', md: '12' },
                  rounded: '3xl',
                  borderWidth: '1px',
                  borderColor: 'gray.100',
                  bg: 'white',
                  transition: 'all',
                  transitionDuration: '500ms',
                  position: 'relative',
                  overflow: 'hidden',
                  _hover: { shadow: 'lg' },
                })}`}
              >
                {/* Hover highlight bar */}
                <div
                  className={cx(
                    'highlight-bar',
                    css({
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      w: '1.5',
                      h: 'full',
                      transition: 'all',
                      transitionDuration: '500ms',
                      opacity: 0,
                    }),
                    highlightBarClasses[index % 4],
                  )}
                />

                <div
                  className={`${flex({
                    direction: { base: 'column', md: 'row' },
                    gap: { base: '8', md: '16' },
                  })} ${css({ md: { alignItems: 'center' }, w: 'full' })}`}
                >
                  {/* Title */}
                  <div className={css({ md: { w: '5/12' } })}>
                    <h3
                      className={css({
                        fontFamily: 'display',
                        fontSize: { base: '2xl', md: '3xl' },
                        fontWeight: 'bold',
                        color: 'ocobo.dark',
                        transition: 'colors',
                      })}
                    >
                      {job.frontmatter.title}
                    </h3>
                  </div>

                  {/* Meta */}
                  <div
                    className={`${flex({ wrap: 'wrap', gap: '6' })} ${css({
                      fontSize: 'sm',
                      fontWeight: 'bold',
                      color: 'gray.500',
                      textTransform: 'uppercase',
                      letterSpacing: 'widest',
                      md: { w: '4/12' },
                    })}`}
                  >
                    <span className={hstack({ gap: '2' })}>
                      <MapPin
                        size={16}
                        className={css({ color: 'ocobo.coral' })}
                      />
                      {job.frontmatter.location}
                    </span>
                    <span
                      className={`${hstack({ gap: '2' })} ${css({
                        px: '3',
                        py: '1',
                        bg: 'gray.50',
                        rounded: 'lg',
                      })}`}
                    >
                      {job.frontmatter.contractType}
                    </span>
                  </div>

                  {/* Arrow */}
                  <div
                    className={`${flex({ justify: 'end', align: 'center', gap: '6' })} ${css(
                      {
                        md: { w: '3/12' },
                      },
                    )}`}
                  >
                    <span
                      className={css({
                        fontSize: 'xs',
                        fontWeight: 'black',
                        color: 'gray.400',
                        textTransform: 'uppercase',
                        letterSpacing: 'widest',
                      })}
                    >
                      {job.frontmatter.seniority}
                    </span>
                    <div
                      className={`arrow-box ${center()} ${css({
                        w: '14',
                        h: '14',
                        bg: 'gray.50',
                        rounded: '2xl',
                        color: 'gray.300',
                        shadow: 'sm',
                      })}`}
                    >
                      <ArrowRight size={24} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
