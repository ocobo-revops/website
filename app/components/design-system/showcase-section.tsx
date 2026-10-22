import type { ReactNode } from 'react';

import { css, cx } from '@ocobo/styled-system/css';
import { styled } from '@ocobo/styled-system/jsx';

import { slugify } from '~/modules/content/toc';

const Section = styled('section', {
  base: {
    py: '8',
    mt: '4',
    borderTop: 'thin',
    borderColor: 'gray.light',
  },
});

export const sectionTitle = css({ textStyle: 'heading2', mb: '4' });
// Leaves room above the heading when an anchor link scrolls to it.
const anchorTarget = css({ scrollMarginTop: '8' });

/** The anchor id of a showcase section, derived from its title. */
export function sectionId(title: string) {
  return slugify(title);
}

type ShowcaseSectionProps = {
  title: string;
  children: ReactNode;
};

/**
 * Frame shared by every `/design-system` section: top border, spacing and
 * the section heading. Each section module renders its demo inside it. The
 * heading carries the id the page's "On this page" list links to.
 */
export function ShowcaseSection({ title, children }: ShowcaseSectionProps) {
  return (
    <Section>
      <h2 id={sectionId(title)} className={cx(sectionTitle, anchorTarget)}>
        {title}
      </h2>
      {children}
    </Section>
  );
}
