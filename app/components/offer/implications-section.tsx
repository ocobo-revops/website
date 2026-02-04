import {
  BarChart3,
  Cog,
  Cpu,
  GraduationCap,
  Layout,
  Search,
} from 'lucide-react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { center, grid, hstack } from '@ocobo/styled-system/patterns';

import { Container } from '../ui/Container';

type BlockColor = 'coral' | 'yellow' | 'sky' | 'mint' | 'purple' | 'dark';

type Block = {
  title: string;
  color: BlockColor;
  items: string[];
};

const iconBgStyles: Record<BlockColor, string> = {
  coral: css({ bg: 'ocobo.coral.light', color: 'ocobo.coral' }),
  yellow: css({ bg: 'ocobo.yellow.light', color: 'ocobo.yellow' }),
  sky: css({ bg: 'ocobo.sky.light', color: 'ocobo.sky' }),
  mint: css({ bg: 'ocobo.mint.light', color: 'ocobo.mint' }),
  purple: css({ bg: 'purple.50', color: 'purple.500' }),
  dark: css({ bg: 'gray.100', color: 'ocobo.dark' }),
};

const bulletStyles: Record<BlockColor, string> = {
  coral: css({ bg: 'ocobo.coral' }),
  yellow: css({ bg: 'ocobo.yellow' }),
  sky: css({ bg: 'ocobo.sky' }),
  mint: css({ bg: 'ocobo.mint' }),
  purple: css({ bg: 'purple.500' }),
  dark: css({ bg: 'ocobo.dark' }),
};

export const ImplicationsSection = () => {
  const { t } = useTranslation('offer');
  const blocks = t('implications.blocks', { returnObjects: true }) as Block[];

  return (
    <section className={css({ py: '24', bg: 'white' })}>
      <Container>
        <div className={css({ mb: '16' })}>
          <h2
            className={css({
              fontFamily: 'display',
              fontSize: '4xl',
              fontWeight: 'bold',
              mb: '6',
            })}
          >
            {t('implications.title')}
          </h2>
          <p className={css({ fontSize: 'xl', color: 'gray.600' })}>
            {t('implications.subtitle')}
          </p>
        </div>

        <div className={grid({ columns: { base: 1, md: 2, lg: 3 }, gap: '8' })}>
          {blocks.map((block) => (
            <div
              key={block.title}
              className={css({
                bg: 'white',
                borderWidth: '1px',
                borderColor: 'gray.100',
                p: '8',
                transition: 'all',
                rounded: 'xl',
                _hover: { shadow: 'lg' },
              })}
            >
              <div
                className={`${center()} ${css({
                  w: '12',
                  h: '12',
                  mb: '6',
                  rounded: 'lg',
                })} ${iconBgStyles[block.color]}`}
              >
                {iconMap[block.color]}
              </div>
              <h3
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontSize: 'xl',
                  mb: '4',
                })}
              >
                {block.title}
              </h3>
              <ul
                className={css({
                  spaceY: '3',
                  fontSize: 'sm',
                  color: 'gray.600',
                })}
              >
                {block.items.map((item) => (
                  <li key={item} className={hstack({ gap: '3' })}>
                    <div
                      className={`${css({
                        w: '1.5',
                        h: '1.5',
                        rounded: 'full',
                        flexShrink: '0',
                      })} ${bulletStyles[block.color]}`}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
const iconMap: Record<BlockColor, React.ReactNode> = {
  coral: <Search size={24} />,
  yellow: <Layout size={24} />,
  sky: <Cog size={24} />,
  mint: <BarChart3 size={24} />,
  purple: <Cpu size={24} />,
  dark: <GraduationCap size={24} />,
};
