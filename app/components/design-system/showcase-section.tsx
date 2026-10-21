import type { ReactNode } from 'react';

import { css } from '@ocobo/styled-system/css';
import { styled } from '@ocobo/styled-system/jsx';

const Section = styled('section', {
  base: {
    py: '8',
    mt: '4',
    borderTop: 'thin',
    borderColor: 'gray.light',
  },
});

export const sectionTitle = css({ textStyle: 'heading2', mb: '4' });

type ShowcaseSectionProps = {
  title: string;
  children: ReactNode;
};

/**
 * Frame shared by every `/design-system` section: top border, spacing and
 * the section heading. Each section module renders its demo inside it.
 */
export function ShowcaseSection({ title, children }: ShowcaseSectionProps) {
  return (
    <Section>
      <h2 className={sectionTitle}>{title}</h2>
      {children}
    </Section>
  );
}
