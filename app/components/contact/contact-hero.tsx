import { Calendar, Check, MessageSquare } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import { FrenchText } from '~/components/typography/french-text';

type BulletKey = 'audit' | 'clarity' | 'zero';

type BulletColor = 'mint' | 'sky' | 'yellow';

const bulletIconColorStyles: Record<BulletColor, string> = {
  mint: css({ bg: 'ocobo.mint.light', color: 'ocobo.mint' }),
  sky: css({ bg: 'ocobo.sky.light', color: 'ocobo.sky' }),
  yellow: css({ bg: 'ocobo.yellow.light', color: 'ocobo.yellow' }),
};

const bullets: ReadonlyArray<{
  key: BulletKey;
  Icon: LucideIcon;
  color: BulletColor;
}> = [
  { key: 'audit', Icon: Check, color: 'mint' },
  { key: 'clarity', Icon: MessageSquare, color: 'sky' },
  { key: 'zero', Icon: Calendar, color: 'yellow' },
];

export const ContactHero = () => {
  const { t } = useTranslation('contact');

  return (
    <div
      className={css({
        pt: { base: '0', lg: '10' },
        lg: { position: 'sticky', top: '32' },
      })}
    >
      <span
        className={cx(
          text({ variant: 'display-label', color: 'coral' }),
          css({ display: 'block', mb: '4' }),
        )}
      >
        <FrenchText>{t('eyebrow')}</FrenchText>
      </span>
      <h1
        data-testid="contact-heading"
        className={cx(
          text({ variant: 'display-xl', color: 'dark' }),
          css({ mb: '8' }),
        )}
      >
        <Trans
          i18nKey="title"
          t={t}
          components={[
            <span
              key="muted"
              className={css({ color: 'gray.400', display: 'block' })}
            />,
          ]}
        />
      </h1>
      <p
        className={cx(
          text({ variant: 'subtitle' }),
          css({ color: 'gray.600', mb: '12' }),
        )}
      >
        <FrenchText>{t('lead')}</FrenchText>
      </p>
      <ul
        className={css({
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '8',
        })}
      >
        {bullets.map(({ key, Icon, color }) => (
          <li
            key={key}
            className={css({
              display: 'flex',
              gap: '6',
              alignItems: 'flex-start',
            })}
          >
            <div
              className={cx(
                css({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  w: '12',
                  h: '12',
                  rounded: 'xl',
                }),
                bulletIconColorStyles[color],
              )}
            >
              <Icon strokeWidth={3} size={20} />
            </div>
            <div>
              <h3
                className={cx(
                  text({ variant: 'display-card', color: 'dark' }),
                  css({ mb: '1' }),
                )}
              >
                <FrenchText>{t(`bullets.${key}.title`)}</FrenchText>
              </h3>
              <p
                className={cx(
                  text({ variant: 'body' }),
                  css({ color: 'gray.600' }),
                )}
              >
                <FrenchText>{t(`bullets.${key}.description`)}</FrenchText>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
