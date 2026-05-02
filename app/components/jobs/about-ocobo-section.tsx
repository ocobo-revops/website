import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { flex, vstack } from '@ocobo/styled-system/patterns';
import { button } from '@ocobo/styled-system/recipes';

type AboutOcoboSectionProps = {
  applyEmail?: string;
  jobTitle?: string;
};

export function AboutOcoboSection({
  applyEmail,
  jobTitle,
}: AboutOcoboSectionProps) {
  const { t } = useTranslation('jobs');
  const benefits = t('about.benefits', { returnObjects: true }) as string[];
  const subject = applyEmail
    ? encodeURIComponent(t('cta.applySubject', { title: jobTitle ?? '' }))
    : undefined;
  const ctaHref = applyEmail
    ? `mailto:${applyEmail}?subject=${subject}`
    : '#apply';

  return (
    <div
      className={css({
        bg: 'ocobo.dark',
        rounded: '2xl',
        color: 'white',
        p: '8',
        position: 'relative',
        overflow: 'hidden',
        shadow: 'xl',
      })}
    >
      <div
        className={css({
          position: 'absolute',
          top: '0',
          right: '0',
          w: '24',
          h: '24',
          bg: 'ocobo.yellow/10',
          rounded: 'full',
          filter: 'blur(32px)',
        })}
      />
      <div className={css({ position: 'relative', zIndex: 10 })}>
        <h5
          className={css({
            fontFamily: 'display',
            fontSize: 'lg',
            fontWeight: 'bold',
            mb: '4',
          })}
        >
          {t('about.title')}
        </h5>
        <ul
          className={vstack({
            gap: '4',
            alignItems: 'stretch',
            mb: '8',
          })}
        >
          {benefits.map((benefit) => (
            <li
              key={benefit}
              className={`${flex({ gap: '3', align: 'start' })} ${css({
                fontSize: 'xs',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: 'widest',
                color: 'gray.400',
              })}`}
            >
              <Plus
                size={12}
                className={css({
                  color: 'ocobo.yellow',
                  flexShrink: 0,
                  mt: '0.5',
                })}
              />
              {benefit}
            </li>
          ))}
        </ul>
        <a
          href={ctaHref}
          className={cx(
            button({ variant: 'white', size: 'sm' }),
            css({ w: 'full', justifyContent: 'center' }),
          )}
        >
          {t('about.cta')}
        </a>
      </div>
    </div>
  );
}
