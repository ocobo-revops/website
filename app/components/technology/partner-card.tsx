import { Award, ExternalLink, Zap } from 'lucide-react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { center, flex, vstack } from '@ocobo/styled-system/patterns';

export interface PartnerData {
  name: string;
  category: string[];
  tags: string[];
  logo: string;
  desc: string;
  status: 'OFFICIAL' | 'EXPERTISE';
  certificationLogo?: string;
  url?: string;
}

const cardStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  bg: 'white',
  borderWidth: '1px',
  borderColor: 'gray.100',
  p: '8',
  transition: 'all',
  transitionDuration: '300ms',
  position: 'relative',
  overflow: 'hidden',
  rounded: 'xl',
  h: 'full',
  _hover: { shadow: 'xl', transform: 'translateY(-4px)' },
  '& .logo-img': { transition: 'all', transitionDuration: '500ms' },
  '&:hover .logo-img': { filter: 'grayscale(0)', opacity: 1 },
  '& .cat-badge': { transition: 'all' },
  '&:hover .cat-badge': { bg: 'ocobo.dark', color: 'white' },
  '& .tag': { transition: 'all' },
  '&:hover .tag': { borderColor: 'ocobo.dark/10', color: 'ocobo.dark' },
  '& .separator': { transition: 'opacity' },
  '&:hover .separator': { opacity: 1 },
  '& .cert-img': { transition: 'all', transitionDuration: '500ms' },
  '&:hover .cert-img': { filter: 'grayscale(0)' },
  '& .tech-label': { transition: 'colors' },
  '&:hover .tech-label': { color: 'ocobo.mint' },
  '& .tech-icon': { transition: 'opacity' },
  '&:hover .tech-icon': { opacity: 1 },
  '& .external-link': { transition: 'all', transitionDuration: '300ms' },
  '&:hover .external-link': { transform: 'translateX(4px)' },
});

const animatedStyles = css({
  animation: 'fade-in-up-small',
  opacity: 0,
});

interface PartnerCardRootProps {
  animate?: boolean;
  children: React.ReactNode;
  className?: string;
}

const PartnerCardRoot = ({
  animate = false,
  children,
  className,
}: PartnerCardRootProps) => {
  return (
    <div
      className={cx(
        cardStyles,
        animate ? animatedStyles : undefined,
        className,
      )}
    >
      {children}
    </div>
  );
};

interface HeaderProps {
  logo: string;
  name: string;
  categories: string[];
  categoryLabels?: Record<string, string>;
}

const Header = ({
  logo,
  name,
  categories,
  categoryLabels = {},
}: HeaderProps) => {
  return (
    <div
      className={`${flex({ justify: 'space-between', align: 'start' })} ${css({ mb: '8' })}`}
    >
      <div
        className={`${center()} ${css({
          w: '16',
          h: '16',
          p: '3',
          bg: 'gray.50',
          rounded: 'xl',
          borderWidth: '1px',
          borderColor: 'transparent',
          shadow: 'inner',
        })}`}
      >
        <img
          src={logo}
          alt={name}
          className={`logo-img ${css({
            maxW: 'full',
            maxH: 'full',
            objectFit: 'contain',
            filter: 'grayscale(100%)',
            opacity: 0.6,
          })}`}
        />
      </div>
      <div className={flex({ direction: 'column', align: 'end', gap: '1' })}>
        {categories.map((cat) => (
          <div
            key={cat}
            className={`cat-badge ${css({
              fontSize: 'xs',
              fontWeight: 'black',
              textTransform: 'uppercase',
              letterSpacing: 'widest',
              bg: 'gray.100',
              color: 'gray.400',
              px: '3',
              py: '1',
              rounded: 'md',
            })}`}
          >
            {categoryLabels[cat] ?? cat}
          </div>
        ))}
      </div>
    </div>
  );
};

interface BodyProps {
  name: string;
  tags: string[];
  description: string;
}

const Body = ({ name, tags, description }: BodyProps) => {
  return (
    <div className={`${vstack()} ${css({ mb: '6', flexGrow: 1 })}`}>
      <h3
        className={css({
          fontFamily: 'display',
          fontSize: '2xl',
          fontWeight: 'black',
          color: 'ocobo.dark',
          mb: '4',
          letterSpacing: 'tight',
        })}
      >
        {name}
      </h3>
      <div
        className={`${flex({ wrap: 'wrap', gap: '1.5' })} ${css({
          h: '48px',
          mb: '4',
          alignContent: 'start',
          overflow: 'hidden',
        })}`}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className={`tag ${css({
              fontSize: 'xs',
              fontWeight: 'bold',
              bg: 'gray.50',
              color: 'gray.400',
              borderWidth: '1px',
              borderColor: 'gray.100',
              px: '2',
              py: '0.5',
              rounded: 'sm',
              whiteSpace: 'nowrap',
            })}`}
          >
            {tag}
          </span>
        ))}
      </div>
      <p
        className={css({
          color: 'gray.500',
          fontSize: 'sm',
          lineHeight: 'relaxed',
          fontWeight: 'medium',
          minH: '4rem',
        })}
      >
        {description}
      </p>
    </div>
  );
};

const Separator = () => {
  return (
    <div
      className={`separator ${css({
        w: 'full',
        h: '1',
        bg: 'ocobo.dark',
        opacity: 0.1,
        mb: '6',
        rounded: 'full',
      })}`}
    />
  );
};

interface FooterProps {
  certificationLogo?: string;
  name: string;
  status: string;
  url?: string;
}

const Footer = ({ certificationLogo, name, status, url }: FooterProps) => {
  const { t } = useTranslation('technology');

  return (
    <div
      className={`${flex({ align: 'center', justify: 'space-between' })} ${css({
        mt: 'auto',
        h: '12',
      })}`}
    >
      <div className={css({ flex: 1 })}>
        {certificationLogo ? (
          <div className={flex({ align: 'center', gap: '2' })}>
            <img
              src={certificationLogo}
              alt={`${name} Platinum`}
              className={`cert-img ${css({
                h: '10',
                w: 'auto',
                objectFit: 'contain',
                filter: 'grayscale(100%)',
              })}`}
            />
          </div>
        ) : status === 'OFFICIAL' ? (
          <div
            className={`${flex({ align: 'center', gap: '1.5' })} ${css({
              fontSize: 'xs',
              fontWeight: 'black',
              textTransform: 'uppercase',
              letterSpacing: 'widest',
              color: 'ocobo.dark',
            })}`}
          >
            <Award size={12} className={css({ color: 'ocobo.yellow' })} />
            {t('ecosystem.status.official')}
          </div>
        ) : (
          <div
            className={`tech-label ${flex({ align: 'center', gap: '1.5' })} ${css(
              {
                fontSize: 'xs',
                fontWeight: 'black',
                textTransform: 'uppercase',
                letterSpacing: 'widest',
                color: 'gray.400',
              },
            )}`}
          >
            <Zap size={12} className={`tech-icon ${css({ opacity: 0.5 })}`} />
            {t('ecosystem.status.expertise')}
          </div>
        )}
      </div>

      <a
        href={url ?? '#'}
        target="_blank"
        rel="noopener noreferrer"
        className={`external-link ${css({
          color: 'gray.300',
          p: '2',
          _hover: { color: 'ocobo.dark' },
        })}`}
      >
        <ExternalLink size={20} />
      </a>
    </div>
  );
};

export const PartnerCard = Object.assign(PartnerCardRoot, {
  Header,
  Body,
  Separator,
  Footer,
});

interface PartnerCardFromDataProps {
  partner: PartnerData;
  animate?: boolean;
  categoryLabels?: Record<string, string>;
}

export const PartnerCardFromData = ({
  partner,
  animate = false,
  categoryLabels,
}: PartnerCardFromDataProps) => {
  return (
    <PartnerCard animate={animate}>
      <PartnerCard.Header
        logo={partner.logo}
        name={partner.name}
        categories={partner.category}
        categoryLabels={categoryLabels}
      />
      <PartnerCard.Body
        name={partner.name}
        tags={partner.tags}
        description={partner.desc}
      />
      <PartnerCard.Separator />
      <PartnerCard.Footer
        certificationLogo={partner.certificationLogo}
        name={partner.name}
        status={partner.status}
        url={partner.url}
      />
    </PartnerCard>
  );
};
