import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';

import { type Language, languages } from '~/localization/resources';

import { getLanguageSwitchPath, getPathLanguage } from './language-path';

type LanguageLinksProps = {
  tone?: 'dark' | 'light';
  className?: string;
};

const toneStyles = {
  dark: css({
    color: 'gray',
    _hover: { color: 'dark' },
    '&[aria-current="true"]': { color: 'dark' },
    _focusVisible: {
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: 'dark',
      outlineOffset: '2px',
    },
  }),
  light: css({
    color: 'gray.400',
    _hover: { color: 'white' },
    '&[aria-current="true"]': { color: 'white' },
    _focusVisible: {
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: 'white',
      outlineOffset: '2px',
    },
  }),
};

/**
 * FR and EN links to the same page in the other language. `tone` picks the
 * colours for a light background (navbar) or a dark one (footer).
 */
export function LanguageLinks({
  tone = 'dark',
  className,
}: LanguageLinksProps) {
  const { t, i18n } = useTranslation('common');
  const { pathname } = useLocation();
  const current = getPathLanguage(pathname, i18n.language as Language);

  return (
    <nav aria-label={t('language.switch')} className={className}>
      <ul className={css({ display: 'flex', alignItems: 'center', gap: '1' })}>
        {languages.map((lng) => (
          <li key={lng}>
            <Link
              to={getLanguageSwitchPath(pathname, lng)}
              hrefLang={lng}
              lang={lng}
              aria-current={lng === current ? 'true' : undefined}
              className={cx(
                css({
                  display: 'inline-flex',
                  px: '2',
                  py: '1',
                  rounded: 'full',
                  fontSize: 'caption',
                  fontWeight: 'bold',
                  letterSpacing: 'chip',
                  transition: 'colors',
                }),
                toneStyles[tone],
              )}
            >
              {t(`language.${lng}.short`)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
