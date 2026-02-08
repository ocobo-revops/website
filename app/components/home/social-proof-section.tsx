import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { section } from '@ocobo/styled-system/recipes';

import type { Testimonial } from '~/routes/_main.($lang)._index';
import { url } from '~/utils/url';

import { Container } from '../ui/Container';
import { ClientMarquee } from './client-marquee';
import { TestimonialCard } from './testimonial-card';

interface SocialProofSectionProps {
  testimonials: Testimonial[];
}

export const SocialProofSection = ({
  testimonials,
}: SocialProofSectionProps) => {
  const { t } = useTranslation('home');

  const clients = testimonials.map((testimonial) => ({
    name: testimonial.name,
    logo: testimonial.logo,
  }));

  const testimonial = testimonials[0];

  return (
    <section
      className={`${section({ bg: 'dark', padding: 'lg' })} ${css({
        py: { base: '20', md: '32' },
        position: 'relative',
        overflow: 'hidden',
      })}`}
    >
      <div
        className={css({
          position: 'absolute',
          inset: '0',
          opacity: '0.02',
        })}
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div
        className={css({
          position: 'absolute',
          top: '50%',
          left: '0',
          w: '64',
          h: '64',
          bg: 'ocobo.yellow/5',
          rounded: 'full',
          transform: 'translateX(-50%)',
          filter: 'blur(48px)',
          opacity: '0.3',
        })}
      />

      <Container className={css({ position: 'relative', zIndex: '10' })}>
        <div className={css({ mb: '16', textAlign: 'center' })}>
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'black',
              color: 'white/40',
              fontSize: 'xs',
              textTransform: 'uppercase',
              letterSpacing: '0.4em',
              mb: '4',
              display: 'inline-block',
            })}
          >
            {t('socialProof.label')}
          </span>
          <h3
            className={css({
              color: 'white',
              fontSize: { base: '3xl', md: '5xl' },
              fontWeight: 'bold',
              mb: '8',
              letterSpacing: 'tight',
            })}
          >
            {t('socialProof.title')}
          </h3>
        </div>

        {clients.length > 0 && (
          <div className={css({ mb: '24' })}>
            <ClientMarquee clients={clients} bordered />
          </div>
        )}

        {testimonial && (
          <TestimonialCard
            quote={testimonial.quote}
            authorName={testimonial.speaker}
            authorRole={`${testimonial.role} @ ${testimonial.name}`}
            authorAvatar={testimonial.avatar}
            ctaText={t('socialProof.ctaText')}
            ctaLink={url.stories}
            className={css({ maxW: '4xl', mx: 'auto' })}
          />
        )}
      </Container>
    </section>
  );
};
