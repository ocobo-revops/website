import { Send } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { button } from '@ocobo/styled-system/recipes';

type ApplyCtaProps = {
  applyEmail: string;
  jobTitle: string;
  tallyFormId?: string;
};

const TALLY_SCRIPT_SRC = 'https://tally.so/widgets/embed.js';

declare global {
  interface Window {
    Tally?: { loadEmbeds: () => void };
  }
}

function loadTallyEmbeds() {
  if (typeof window === 'undefined') return;
  if (window.Tally) {
    window.Tally.loadEmbeds();
    return;
  }
  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${TALLY_SCRIPT_SRC}"]`,
  );
  if (existing) {
    existing.addEventListener('load', () => window.Tally?.loadEmbeds());
    return;
  }
  const script = document.createElement('script');
  script.src = TALLY_SCRIPT_SRC;
  script.async = true;
  script.addEventListener('load', () => window.Tally?.loadEmbeds());
  document.body.appendChild(script);
}

export function ApplyCta({ applyEmail, jobTitle, tallyFormId }: ApplyCtaProps) {
  const { t } = useTranslation('jobs');
  const subject = encodeURIComponent(
    t('cta.applySubject', { title: jobTitle }),
  );

  useEffect(() => {
    if (tallyFormId) loadTallyEmbeds();
  }, [tallyFormId]);

  const tallySrc = tallyFormId
    ? `https://tally.so/embed/${tallyFormId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`
    : null;

  return (
    <div
      id="apply"
      className={css({
        mt: '24',
        bg: 'ocobo.yellow',
        p: { base: '10', md: '14' },
        rounded: '3xl',
        position: 'relative',
        overflow: 'hidden',
        shadow: '2xl',
        scrollMarginTop: '40',
      })}
    >
      <div className={css({ position: 'relative', zIndex: 10 })}>
        <h2
          className={css({
            fontFamily: 'display',
            fontSize: '4xl',
            fontWeight: 'black',
            color: 'ocobo.dark',
            mb: '4',
            letterSpacing: 'tight',
          })}
        >
          {t('apply.title')}
        </h2>
        <p
          className={css({
            color: 'ocobo.dark/70',
            fontWeight: 'bold',
            fontSize: 'lg',
            mb: '12',
            maxW: 'xl',
          })}
        >
          {t('apply.desc')}
        </p>
        {tallySrc ? (
          <iframe
            data-tally-src={tallySrc}
            loading="lazy"
            width="100%"
            height={200}
            scrolling="no"
            title={t('apply.formTitle', { title: jobTitle })}
            className={css({
              w: 'full',
              border: 'none',
              bg: 'transparent',
              overflow: 'hidden',
            })}
          />
        ) : (
          <a
            href={`mailto:${applyEmail}?subject=${subject}`}
            className={button({ variant: 'primary', size: 'lg' })}
          >
            <Send size={14} />
            {t('apply.cta')}
          </a>
        )}
      </div>
    </div>
  );
}
