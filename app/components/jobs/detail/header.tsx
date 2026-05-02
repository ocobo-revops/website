import { ArrowLeft, Briefcase, MapPin, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { css } from '@ocobo/styled-system/css';
import { flex, hstack } from '@ocobo/styled-system/patterns';
import { badge } from '@ocobo/styled-system/recipes';

import type { JobFrontmatter } from '~/modules/schemas';

type HeaderProps = {
  frontmatter: JobFrontmatter;
  lang: string;
};

export function Header({ frontmatter, lang }: HeaderProps) {
  const { t } = useTranslation('jobs');

  return (
    <div className={css({ mb: '20' })}>
      {/* Breadcrumb */}
      <Link
        to={`/${lang}/jobs`}
        className={`${hstack({ gap: '2' })} ${css({
          display: 'inline-flex',
          color: 'gray.400',
          fontWeight: 'black',
          textTransform: 'uppercase',
          letterSpacing: 'widest',
          fontSize: 'xs',
          transition: 'colors',
          mb: '12',
          _hover: { color: 'ocobo.dark' },
        })}`}
      >
        <ArrowLeft size={14} />
        {t('detail.breadcrumb')}
      </Link>

      {/* Centered hero */}
      <div className={css({ maxW: '5xl', mx: 'auto', textAlign: 'center' })}>
        <span
          className={`${badge({ variant: 'yellow' })} ${css({ mb: '8', display: 'inline-block' })}`}
        >
          {t('detail.category')}
        </span>
        <h1
          className={css({
            fontFamily: 'display',
            fontSize: { base: '4xl', md: '6xl' },
            fontWeight: 'black',
            color: 'ocobo.dark',
            mb: '10',
            lineHeight: '1.05',
            letterSpacing: 'tight',
          })}
        >
          {frontmatter.title}
        </h1>
        <div
          className={`${flex({ gap: '6', justify: 'center', wrap: 'wrap' })} ${css(
            {
              fontSize: 'xs',
              fontWeight: 'black',
              color: 'gray.400',
              textTransform: 'uppercase',
              letterSpacing: 'widest',
            },
          )}`}
        >
          <div
            className={`${hstack({ gap: '2.5' })} ${css({
              px: '4',
              py: '2',
              bg: 'gray.50/50',
              borderWidth: '1px',
              borderColor: 'gray.100',
              rounded: 'full',
            })}`}
          >
            <Briefcase size={14} className={css({ color: 'ocobo.yellow' })} />
            <span className={css({ color: 'ocobo.dark' })}>
              {frontmatter.contractType}
            </span>
          </div>
          <div
            className={`${hstack({ gap: '2.5' })} ${css({
              px: '4',
              py: '2',
              bg: 'gray.50/50',
              borderWidth: '1px',
              borderColor: 'gray.100',
              rounded: 'full',
            })}`}
          >
            <MapPin size={14} className={css({ color: 'ocobo.sky' })} />
            <span className={css({ color: 'ocobo.dark' })}>
              {frontmatter.location}
            </span>
          </div>
          <div
            className={`${hstack({ gap: '2.5' })} ${css({
              px: '4',
              py: '2',
              bg: 'gray.50/50',
              borderWidth: '1px',
              borderColor: 'gray.100',
              rounded: 'full',
            })}`}
          >
            <Star size={14} className={css({ color: 'ocobo.mint' })} />
            <span className={css({ color: 'ocobo.dark' })}>
              {frontmatter.seniority}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
