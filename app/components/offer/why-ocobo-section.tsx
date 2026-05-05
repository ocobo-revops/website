import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { center, grid } from '@ocobo/styled-system/patterns';
import { text } from '@ocobo/styled-system/recipes';

import { Container } from '../ui/Container';
import { SectionHeader } from './section-header';

type Reason = {
  title: string;
  description: string;
  color: 'yellow' | 'coral' | 'mint';
};

const checkBgStyles: Record<Reason['color'], string> = {
  yellow: css({ bg: 'ocobo.yellow' }),
  coral: css({ bg: 'ocobo.coral' }),
  mint: css({ bg: 'ocobo.mint' }),
};

export const WhyOcoboSection = () => {
  const { t } = useTranslation('offer');
  const reasons = t('whyOcobo.reasons', { returnObjects: true }) as Reason[];

  return (
    <section className={css({ py: '24', bg: 'ocobo.dark', color: 'white' })}>
      <Container>
        <SectionHeader
          title={t('whyOcobo.title')}
          light
          className={css({ mb: '16' })}
        />
        <div className={grid({ columns: { base: 1, md: 3 }, gap: '12' })}>
          {reasons.map((reason) => (
            <div key={reason.title} className={css({ textAlign: 'center' })}>
              <div
                className={cx(
                  center({ inline: true }),
                  css({
                    w: '16',
                    h: '16',
                    rounded: 'full',
                    color: 'ocobo.dark',
                    mx: 'auto',
                    mb: '6',
                    flexShrink: '0',
                  }),
                  checkBgStyles[reason.color],
                )}
              >
                <CheckCircle2 size={32} strokeWidth={4} />
              </div>
              <h3
                className={cx(
                  text({ variant: 'display-card', color: 'white' }),
                  css({ mb: '4' }),
                )}
              >
                {reason.title}
              </h3>
              <p className={css({ color: 'gray.300', lineHeight: 'relaxed' })}>
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
