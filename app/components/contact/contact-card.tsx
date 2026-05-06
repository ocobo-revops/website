import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { card, text } from '@ocobo/styled-system/recipes';

import { FrenchText } from '~/components/typography/french-text';

const inputBaseStyles = {
  width: 'full',
  px: '4',
  py: '4',
  bg: 'gray.50',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'gray.100',
  borderRadius: 'md',
  color: 'ocobo.dark',
  fontSize: 'base',
  fontFamily: 'body',
  outline: 'none',
  transition: 'background 0.2s, border-color 0.2s',
  _focus: {
    bg: 'white',
    borderColor: 'ocobo.dark',
  },
  _placeholder: { color: 'gray.300' },
} as const;

const labelBaseStyles = {
  display: 'block',
  fontSize: 'xs',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  color: 'gray.500',
  mb: '2',
} as const;

const formScopedStyles = css({
  '& .hbspt-form input[type="text"]': inputBaseStyles,
  '& .hbspt-form input[type="email"]': inputBaseStyles,
  '& .hbspt-form input[type="tel"]': inputBaseStyles,
  '& .hbspt-form input[type="number"]': inputBaseStyles,
  '& .hbspt-form select': inputBaseStyles,
  '& .hbspt-form textarea': { ...inputBaseStyles, minHeight: '32' },

  '& .hbspt-form label': labelBaseStyles,
  '& .hbspt-form .hs-form-required': {
    color: 'ocobo.coral',
    ml: '1',
  },

  '& .hbspt-form .hs-form-field': { mb: '6' },

  '& .hbspt-form .hs-error-msgs': { listStyle: 'none', mt: '2', p: '0' },
  '& .hbspt-form .hs-error-msgs label': {
    fontSize: 'xs',
    fontWeight: 'normal',
    textTransform: 'none',
    letterSpacing: 'normal',
    color: 'red.500',
  },
  '& .hbspt-form .hs-error-msg': {
    fontSize: 'xs',
    color: 'red.500',
    fontWeight: 'normal',
    textTransform: 'none',
    letterSpacing: 'normal',
    mt: '1',
  },

  '& .hbspt-form .form-columns-2': {
    md: { display: 'flex', gap: '4' },
  },
  '& .hbspt-form .form-columns-2 > .hs-form-field': {
    md: { flex: '1', minWidth: '0' },
  },

  '& .hbspt-form .hs-submit': { pt: '6' },
  '& .hbspt-form .hs-button': {
    width: 'full',
    py: '4',
    px: '6',
    bg: 'ocobo.dark',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 'base',
    borderRadius: 'md',
    borderWidth: '0',
    cursor: 'pointer',
    boxShadow: 'xl',
    transition: 'background 0.2s, box-shadow 0.2s, transform 0.2s',
    _hover: {
      bg: 'black',
      boxShadow: '2xl',
      transform: 'translateY(-1px)',
    },
  },
});

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
        formScopedStyles,
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
