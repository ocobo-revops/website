import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { card, text } from '@ocobo/styled-system/recipes';

import { FrenchText } from '~/components/typography/french-text';

type ContactCardProps = {
  children: ReactNode;
};

export const ContactCard = ({ children }: ContactCardProps) => {
  const { t } = useTranslation('contact');

  return (
    <div
      className={cx(
        card({ padding: 'lg', tone: 'white', border: true }),
        css({
          p: { base: '8', md: '12' },
          shadow: 'card',
          position: 'relative',
          overflow: 'hidden',
        }),
      )}
    >
      <div
        className={css({
          position: 'absolute',
          top: 0,
          left: 0,
          w: 'full',
          h: '1',
          bgGradient: 'to-r',
          gradientFrom: 'ocobo.yellow',
          gradientVia: 'ocobo.coral',
          gradientTo: 'ocobo.sky',
        })}
      />
      <h2
        className={cx(
          text({ variant: 'display-md-bold', color: 'dark' }),
          css({ mb: '8' }),
        )}
      >
        <FrenchText>{t('card.heading')}</FrenchText>
      </h2>
      {children}
      <p
        className={css({
          textAlign: 'center',
          fontSize: 'xs',
          color: 'gray.400',
          mt: '4',
        })}
      >
        <FrenchText>{t('consent')}</FrenchText>
      </p>
    </div>
  );
};
