import { type LucideIcon, Target, Users, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { card, iconBox, section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';

const ICONS: Record<string, LucideIcon> = {
  users: Users,
  zap: Zap,
  target: Target,
};

type ModelCard = {
  icon: string;
  title: string;
  description: string;
};

/** The Studio model: three principles on a dark band (`#squad`). */
export function ModelSection() {
  const { t } = useTranslation('studio');
  const cards = t('model.cards', { returnObjects: true }) as ModelCard[];

  return (
    <section
      id="squad"
      className={cx(section({ bg: 'dark' }), css({ scrollMarginTop: '24' }))}
    >
      <Container>
        <div className={css({ maxW: '3xl', mb: '14' })}>
          <h2
            className={cx(
              text({ variant: 'display-lg', color: 'white' }),
              css({ mb: '5' }),
            )}
          >
            {t('model.title')}
          </h2>
          <p className={text({ variant: 'body', color: 'muted-light' })}>
            {t('model.subtitle')}
          </p>
        </div>

        <ul
          className={css({
            display: 'grid',
            gridTemplateColumns: {
              base: '1fr',
              md: 'repeat(3, minmax(0, 1fr))',
            },
            gap: '6',
          })}
        >
          {cards.map((item) => {
            const Icon = ICONS[item.icon] ?? Users;
            return (
              <li
                key={item.title}
                className={cx(card({ padding: 'lg' }), css({ gap: '4' }))}
              >
                <span
                  className={iconBox({
                    size: 'xl',
                    variant: 'solid',
                    color: 'mint',
                  })}
                >
                  <Icon size={26} aria-hidden="true" />
                </span>
                <h3 className={text({ variant: 'display-md-bold' })}>
                  {item.title}
                </h3>
                <p className={text({ variant: 'body', color: 'muted' })}>
                  {item.description}
                </p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
