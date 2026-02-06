import type React from 'react';

import { css } from '@ocobo/styled-system/css';
import { center } from '@ocobo/styled-system/patterns';
import { section } from '@ocobo/styled-system/recipes';

import { ButtonLink } from '~/components/ui/button-link';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';

import { Container } from '../ui/Container';

type CtaVariant = 'yellow' | 'sky' | 'dark' | 'mint';

interface CtaSectionProps {
  variant?: CtaVariant;
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaLink: string;
}

const variantToSectionBg: Record<
  CtaVariant,
  'yellow' | 'sky' | 'dark' | 'mint'
> = {
  yellow: 'yellow',
  sky: 'sky',
  dark: 'dark',
  mint: 'mint',
};

const variantStyles: Record<
  CtaVariant,
  { subtitleColor: string; buttonVariant: 'cta' | 'primary' }
> = {
  yellow: {
    subtitleColor: 'ocobo.dark/70',
    buttonVariant: 'cta',
  },
  sky: {
    subtitleColor: 'gray.600',
    buttonVariant: 'cta',
  },
  dark: {
    subtitleColor: 'white/80',
    buttonVariant: 'primary',
  },
  mint: {
    subtitleColor: 'ocobo.dark/70',
    buttonVariant: 'cta',
  },
};

export const CtaSection: React.FC<CtaSectionProps> = ({
  variant = 'yellow',
  title,
  subtitle,
  ctaText,
  ctaLink,
}) => {
  const getLocalizedPath = useLocalizedPathname();
  const styles = variantStyles[variant];

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
          className={css({
            fontFamily: 'display',
            fontSize: { base: '4xl', md: '5xl' },
            fontWeight: 'black',
            mb: '8',
            letterSpacing: 'tight',
          })}
        >
          {title}
        </h2>
        {subtitle ? (
          <p
            className={css({
              fontSize: { base: 'lg', md: 'xl' },
              fontWeight: 'bold',
              mb: '12',
              color: styles.subtitleColor,
            })}
          >
            {subtitle}
          </p>
        ) : null}
        <div className={center()}>
          <ButtonLink
            to={getLocalizedPath(ctaLink)}
            variant={styles.buttonVariant}
            size="lg"
          >
            {ctaText}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
};
