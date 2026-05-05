import type React from 'react';

import { css, cx } from '@ocobo/styled-system/css';
import { center } from '@ocobo/styled-system/patterns';
import { section, text } from '@ocobo/styled-system/recipes';

import { ButtonLink } from '~/components/ui/button-link';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';

import { Container } from '../ui/Container';

type CtaVariant = 'yellow' | 'sky' | 'dark';

interface CtaSectionProps {
  variant?: CtaVariant;
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaLink: string;
}

const variantToSectionBg: Record<CtaVariant, 'yellow' | 'sky' | 'dark'> = {
  yellow: 'yellow',
  sky: 'sky',
  dark: 'dark',
};

const subtitleColorStyles: Record<CtaVariant, string> = {
  yellow: css({ color: 'ocobo.dark/70' }),
  sky: css({ color: 'gray.600' }),
  dark: css({ color: 'white/80' }),
};

const buttonVariants: Record<CtaVariant, 'cta' | 'primary'> = {
  yellow: 'cta',
  sky: 'cta',
  dark: 'primary',
};

export const CtaSection: React.FC<CtaSectionProps> = ({
  variant = 'yellow',
  title,
  subtitle,
  ctaText,
  ctaLink,
}) => {
  const getLocalizedPath = useLocalizedPathname();

  return (
    <section
      className={`${section({ bg: variantToSectionBg[variant], padding: 'lg' })} ${css(
        {
          py: '32',
        },
      )}`}
    >
      <Container className={css({ textAlign: 'center' })}>
        <h2
          className={cx(
            text({ variant: 'display-lg' }),
            css({
              fontSize: { base: '4xl', md: '5xl' },
              mb: '8',
            }),
          )}
        >
          {title}
        </h2>
        {subtitle ? (
          <p
            className={cx(
              css({
                fontSize: { base: 'lg', md: 'xl' },
                fontWeight: 'bold',
                mb: '12',
              }),
              subtitleColorStyles[variant],
            )}
          >
            {subtitle}
          </p>
        ) : null}
        <div className={center()}>
          <ButtonLink
            to={getLocalizedPath(ctaLink)}
            variant={buttonVariants[variant]}
            size="lg"
          >
            {ctaText}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
};
