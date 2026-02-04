import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { center, grid } from '@ocobo/styled-system/patterns';

import { Container } from '../ui/Container';
import { SectionHeader } from './section-header';

type Reason = {
  title: string;
  description: string;
  color: 'yellow' | 'coral' | 'mint';
};

const colorMap: Record<Reason['color'], string> = {
  yellow: 'ocobo.yellow',
  coral: 'ocobo.coral',
  mint: 'ocobo.mint',
} as const;

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
                className={`${center()} ${css({
                  w: '16',
                  h: '16',
                  bg: colorMap[reason.color],
                  rounded: 'full',
                  color: 'ocobo.dark',
                  mx: 'auto',
                  mb: '6',
                })}`}
              >
                <CheckCircle2 size={32} strokeWidth={4} />
              </div>
              <h3
                className={css({
                  fontFamily: 'display',
                  fontSize: 'xl',
                  fontWeight: 'bold',
                  mb: '4',
                })}
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
