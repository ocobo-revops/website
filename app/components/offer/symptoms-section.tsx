import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { center, flex, hstack } from '@ocobo/styled-system/patterns';

import { Container } from '../ui/Container';
import { PyramidSection } from './pyramid-section';

type RoleKey = 'ceo' | 'managers' | 'teams' | 'clients';

type RoleData = {
  title: string;
  items: string[];
};

type PyramidData = Record<RoleKey, RoleData>;

const ROLE_ORDER: { key: RoleKey; color: string }[] = [
  { key: 'ceo', color: 'ocobo.coral' },
  { key: 'managers', color: 'ocobo.yellow' },
  { key: 'teams', color: 'ocobo.sky' },
  { key: 'clients', color: 'ocobo.mint' },
];

export const SymptomsSection = () => {
  const { t } = useTranslation('offer');
  const pyramid = t('symptoms.pyramid', { returnObjects: true }) as PyramidData;

  return (
    <section
      className={css({
        pt: { base: '12', md: '24' },
        pb: '0',
        bg: 'white',
        overflow: 'hidden',
      })}
    >
      <Container>
        <div
          className={css({ textAlign: 'center', mb: { base: '16', md: '24' } })}
        >
          <h2
            className={css({
              fontFamily: 'display',
              fontSize: { base: '3xl', md: '5xl' },
              fontWeight: 'bold',
              color: 'ocobo.dark',
              mb: '6',
              lineHeight: 'tight',
            })}
          >
            {t('symptoms.title.line1')}
            <br className={css({ display: { base: 'none', md: 'block' } })} />
            {t('symptoms.title.line2')}
          </h2>
          <p
            className={css({
              fontSize: { base: 'lg', md: 'xl' },
              color: 'gray.600',
              fontWeight: 'medium',
            })}
          >
            {t('symptoms.subtitle')}
          </p>
        </div>

        <div
          className={css({
            display: { md: 'none' },
            spaceY: '8',
            pb: '12',
          })}
        >
          {ROLE_ORDER.map(({ key, color }, index) => {
            const role = pyramid[key];
            return (
              <div
                key={key}
                className={css({
                  bg: 'gray.50',
                  p: '6',
                  rounded: '2xl',
                  borderWidth: '1px',
                  borderColor: 'gray.100',
                  position: 'relative',
                  overflow: 'hidden',
                })}
              >
                <div
                  className={css({
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    w: '20',
                    h: '20',
                    bg: color,
                    opacity: '0.1',
                    roundedBottomLeft: 'full',
                  })}
                />
                <div className={`${hstack({ gap: '4' })} ${css({ mb: '4' })}`}>
                  <div
                    className={`${center()} ${css({
                      w: '10',
                      h: '10',
                      bg: 'white',
                      borderWidth: '1px',
                      borderColor: 'ocobo.dark',
                      rounded: 'full',
                      fontFamily: 'display',
                      fontWeight: 'bold',
                      fontSize: 'lg',
                      shadow: 'sm',
                    })}`}
                  >
                    {index + 1}
                  </div>
                  <h3
                    className={css({
                      fontFamily: 'display',
                      fontSize: 'xl',
                      fontWeight: 'bold',
                      color: 'ocobo.dark',
                    })}
                  >
                    {role.title}
                  </h3>
                </div>
                <ul
                  className={css({
                    spaceY: '2',
                    fontSize: 'sm',
                    color: 'gray.600',
                  })}
                >
                  {role.items.map((item) => (
                    <li
                      key={item}
                      className={flex({ align: 'flex-start', gap: '2' })}
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className={css({ display: { base: 'none', md: 'block' } })}>
          <PyramidSection />
        </div>
      </Container>
    </section>
  );
};
