import { ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { badge, button, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';

import { RoiHeroChart } from './roi-hero-chart';
import { ROI_WALKTHROUGH_ID } from './roi-ids';
import { dotBackdropHero } from './roi-styles';

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
    <div
      className={cx(
        dotBackdropHero,
        // The layout already clears the navbar (96 to 128px): the badge sits
        // 168px from the top from tablet up, as in the mockup.
        css({
          pt: { base: '16', md: '14', lg: '10' },
          pb: '10',
          textAlign: 'center',
        }),
      )}
    >
      <Container>
        <div className={css({ maxW: '4xl', mx: 'auto' })}>
          <span className={cx(badge({ variant: 'yellow' }), css({ mb: '7' }))}>
            {t('hero.badge')}
          </span>
          {/* The reset balances headings, which breaks after "une". */}
          <h1
            className={cx(
              text({ variant: 'display-xl' }),
              css({ mb: '6', textWrap: 'wrap' }),
            )}
          >
            {t('hero.title.line1')}
            <br />
            <span className={marker}>{t('hero.title.highlight')}</span>
          </h1>
          <p
            className={cx(
              text({ variant: 'body' }),
              // The lead size of the redesigned heroes (about, method, offer).
              css({
                fontSize: 'xl',
                fontWeight: 'medium',
                lineHeight: 'relaxed',
                color: 'gray.600',
                maxW: '2xl',
                mx: 'auto',
                mb: '9',
              }),
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
    </div>
  );
}
