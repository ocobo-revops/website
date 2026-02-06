import { CheckCircle2 } from 'lucide-react';
import { Fragment } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { center, flex } from '@ocobo/styled-system/patterns';
import { badge } from '@ocobo/styled-system/recipes';

import { Container } from '../ui/Container';
import { SectionHeader } from './section-header';

type ServiceColor = 'yellow' | 'sky' | 'mint';

type ServiceItem = {
  title: string;
  description: string;
};

type Service = {
  number: number;
  badge: string;
  badgeColor: ServiceColor;
  subtitle: string;
  title: string;
  description: string;
  items: ServiceItem[];
};

const COLOR_TOKEN_MAP: Record<ServiceColor, string> = {
  yellow: 'ocobo.yellow',
  sky: 'ocobo.sky',
  mint: 'ocobo.mint',
};

const LIGHT_TOKEN_MAP: Record<ServiceColor, string> = {
  yellow: 'ocobo.yellow.light',
  sky: 'ocobo.sky.light',
  mint: 'ocobo.mint.light',
};

const iconWrapperStyle = (color: ServiceColor) =>
  css({
    mt: '1',
    bg: LIGHT_TOKEN_MAP[color],
    p: '2',
    rounded: 'full',
    color: COLOR_TOKEN_MAP[color],
    _groupHover: { bg: COLOR_TOKEN_MAP[color], color: 'white' },
    transition: 'colors',
  });

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  const color = service.badgeColor;
  const colorToken = COLOR_TOKEN_MAP[color];

  return (
    <div
      className={flex({
        direction: { base: 'column', md: 'row' },
        gap: { base: '12', md: '24' },
        align: 'flex-start',
      })}
    >
      <div
        className={css({
          w: { base: 'full', md: '5/12' },
          position: { md: 'sticky' },
          top: '32',
        })}
      >
        <div
          className={`${center({ inline: true })} ${css({
            w: '16',
            h: '16',
            bg: colorToken,
            color: 'ocobo.dark',
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: '2xl',
            borderWidth: '1px',
            borderColor: 'ocobo.dark',
            shadow: 'offset',
            mb: '8',
            flexShrink: '0',
            alignSelf: 'flex-start',
          })}`}
        >
          {service.number}
        </div>
        <div className={css({ mb: '4' })}>
          <span className={badge({ variant: color })}>{service.badge}</span>
          <p
            className={css({
              fontSize: '2xs',
              fontWeight: 'black',
              textTransform: 'uppercase',
              letterSpacing: 'widest',
              mt: '3',
              ml: '1',
              opacity: '0.7',
              color: colorToken,
            })}
          >
            {service.subtitle}
          </p>
        </div>
        <h3
          className={css({
            fontFamily: 'display',
            fontSize: { base: '3xl', md: '4xl' },
            fontWeight: 'bold',
            color: 'ocobo.dark',
            mb: '4',
            lineHeight: 'tight',
          })}
        >
          {service.title}
        </h3>
        <p
          className={css({
            color: 'gray.600',
            fontSize: 'lg',
            lineHeight: 'relaxed',
          })}
        >
          {service.description}
        </p>
      </div>
      <div className={css({ w: { base: 'full', md: '7/12' } })}>
        <div
          className={`group ${css({
            bg: 'white',
            borderWidth: '1px',
            borderColor: 'gray.100',
            p: { base: '8', md: '10' },
            transition: 'all',
            transitionDuration: '300ms',
            rounded: 'xl',
            _hover: { shadow: '2xl', borderColor: colorToken },
          })}`}
        >
          <ul className={css({ spaceY: '8' })}>
            {service.items.map((item) => (
              <li
                key={item.title}
                className={flex({ gap: '5', align: 'flex-start' })}
              >
                <div className={iconWrapperStyle(color)}>
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h4
                    className={css({
                      fontWeight: 'bold',
                      fontSize: 'lg',
                      color: 'ocobo.dark',
                      mb: '2',
                    })}
                  >
                    {item.title}
                  </h4>
                  <p
                    className={css({
                      fontSize: 'base',
                      color: 'gray.600',
                      lineHeight: 'relaxed',
                    })}
                  >
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const OffersDetailSection = () => {
  const { t } = useTranslation('offer');
  const services = t('offersDetail.services', {
    returnObjects: true,
  }) as Service[];

  return (
    <section className={css({ py: { base: '16', md: '24' }, bg: 'white' })}>
      <Container>
        <SectionHeader
          title={t('offersDetail.header.title')}
          subtitle={t('offersDetail.header.subtitle')}
          className={css({ mb: { base: '16', md: '24' } })}
        />

        <div className={css({ spaceY: '24' })}>
          {services.map((service, index) => (
            <Fragment key={service.title}>
              {index > 0 && (
                <div className={css({ w: 'full', h: '1px', bg: 'gray.100' })} />
              )}
              <ServiceCard service={service} />
            </Fragment>
          ))}
        </div>
      </Container>
    </section>
  );
};
