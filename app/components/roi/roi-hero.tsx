import { ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { badge, button, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';

import { RoiHeroChart } from './roi-hero-chart';
import { ROI_WALKTHROUGH_ID } from './roi-ids';

// A yellow marker under the last words of the headline (mockup `roi`).
// The page keeps gradient text for AI content only (ADR 0002).
const marker = css({
  bgImage: '[linear-gradient(var(--colors-yellow), var(--colors-yellow))]',
  bgRepeat: 'no-repeat',
  bgSize: '[100% 0.32em]',
  bgPosition: '[0 88%]',
});

export function RoiHero() {
  const { t } = useTranslation('roi');

  return (
    <header
      className={css({
        pt: '40',
        pb: '10',
        textAlign: 'center',
        overflow: 'hidden',
      })}
    >
      <Container>
        <div className={css({ maxW: '4xl', mx: 'auto' })}>
          <span className={cx(badge({ variant: 'yellow' }), css({ mb: '7' }))}>
            {t('hero.badge')}
          </span>
          <h1 className={cx(text({ variant: 'display-xl' }), css({ mb: '6' }))}>
            {t('hero.title.line1')}
            <br />
            <span className={marker}>{t('hero.title.highlight')}</span>
          </h1>
          <p
            className={cx(
              text({ variant: 'body', color: 'muted' }),
              css({ maxW: '2xl', mx: 'auto', mb: '9' }),
            )}
          >
            {t('hero.subtitle')}
          </p>
          <a
            href={`#${ROI_WALKTHROUGH_ID}`}
            className={button({ variant: 'cta', size: 'lg' })}
          >
            {t('hero.cta')}
            <ArrowDown size={18} aria-hidden="true" />
          </a>
        </div>
        <RoiHeroChart />
      </Container>
    </header>
  );
}
