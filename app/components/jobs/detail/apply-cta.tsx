import { Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { center } from '@ocobo/styled-system/patterns';

type ApplyCtaProps = {
  applyEmail: string;
  jobTitle: string;
};

export function ApplyCta({ applyEmail, jobTitle }: ApplyCtaProps) {
  const { t } = useTranslation('jobs');
  const subject = encodeURIComponent(
    t('cta.applySubject', { title: jobTitle }),
  );

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
        <a
          href={`mailto:${applyEmail}?subject=${subject}`}
          className={`${center({ gap: '3' })} ${css({
            display: 'inline-flex',
            px: '8',
            py: '5',
            bg: 'ocobo.dark',
            color: 'white',
            fontWeight: 'black',
            textTransform: 'uppercase',
            letterSpacing: '0.4em',
            fontSize: 'xs',
            rounded: 'xl',
            transition: 'all',
            shadow: 'xl',
            _hover: { bg: 'black' },
          })}`}
        >
          <Send size={14} />
          {t('apply.cta')}
        </a>
      </div>
    </div>
  );
}
