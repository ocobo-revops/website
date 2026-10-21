import { Linkedin, Youtube } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { center } from '@ocobo/styled-system/patterns';
import { text } from '@ocobo/styled-system/recipes';

import { LanguageLinks } from '~/components/navbar-v2/language-links';
import type { NavItem } from '~/components/navbar/types';
import { Container } from '~/components/ui/Container';
import { Logocobo } from '~/components/ui/Logocobo';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { useMenuItems } from '~/hooks/useMenuItems';
import { url } from '~/utils/url';

type FooterLink = {
  key: string;
  label: string;
  path: string;
  isExternal?: boolean;
};

/**
 * Link row, in the mockup order. Labels and paths come from the menu, so
 * hidden pages drop out here too.
 */
const FOOTER_LINK_KEYS = [
  'podcasts',
  'club',
  'about',
  'stories',
  'blog',
  'jobs',
] as const;

const LINKEDIN_URL = 'https://www.linkedin.com/company/ocobofr/';

const focusRing = css({
  _focusVisible: {
    outlineWidth: '2px',
    outlineStyle: 'solid',
    outlineColor: 'white',
    outlineOffset: '0.5',
  },
});

const linkStyles = cx(
  css({
    rounded: 'lg',
    transition: 'colors',
    _hover: { color: 'ocobo.yellow' },
  }),
  focusRing,
);

const mutedLinkStyles = cx(
  css({
    rounded: 'lg',
    transition: 'colors',
    _hover: { color: 'white' },
  }),
  focusRing,
);

const socialStyles = cx(
  center(),
  css({
    w: '8',
    h: '8',
    rounded: 'full',
    bg: 'white/10',
    transition: 'colors',
    _hover: { bg: 'white', color: 'dark' },
  }),
  focusRing,
);

const topRowLayout = {
  auto: css({
    flexDirection: { base: 'column', lg: 'row' },
    alignItems: { base: 'flex-start', lg: 'center' },
  }),
  mobile: css({ flexDirection: 'column', alignItems: 'flex-start' }),
};

type FooterV2Props = {
  /**
   * `auto` stacks the top row below 1024px. `mobile` stacks it at any
   * width, for the design-system preview.
   */
  layout?: 'auto' | 'mobile';
};

function pickFooterLinks(items: NavItem[]): FooterLink[] {
  const byKey = new Map<string, FooterLink>();
  for (const item of items) {
    if (item.path && !item.isButton && !item.shouldHide) {
      byKey.set(item.key, {
        key: item.key,
        label: item.label,
        path: item.path,
        isExternal: item.isExternal,
      });
    }
    for (const sub of item.dropdown ?? []) {
      if (!sub.shouldHide) {
        byKey.set(sub.key, sub);
      }
    }
  }
  return FOOTER_LINK_KEYS.flatMap((key) => {
    const link = byKey.get(key);
    return link ? [link] : [];
  });
}

/**
 * v2 footer: wordmark and one row of links, then a legal row. Built but not
 * switched on: `LayoutMain` still renders the v1 footer until #242.
 */
export function FooterV2({ layout = 'auto' }: FooterV2Props) {
  const { t } = useTranslation('common');
  const getLocalizedPath = useLocalizedPathname();
  const links = pickFooterLinks(useMenuItems());

  return (
    <footer className={css({ bg: 'dark', color: 'white', py: '16' })}>
      <Container>
        <div
          className={cx(
            css({
              display: 'flex',
              justifyContent: 'space-between',
              gap: '8',
            }),
            topRowLayout[layout],
          )}
        >
          <NavLink
            to={getLocalizedPath('/')}
            aria-label={t('navigation.home')}
            className={linkStyles}
          >
            <Logocobo
              aria-hidden="true"
              className={css({ h: '6', w: 'auto' })}
            />
          </NavLink>

          <nav aria-label={t('footer.navigation')}>
            <ul
              className={cx(
                text({ variant: 'body' }),
                css({
                  display: 'flex',
                  flexWrap: 'wrap',
                  columnGap: '7',
                  rowGap: '3',
                }),
              )}
            >
              {links.map((link) => (
                <li key={link.key}>
                  {link.isExternal ? (
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkStyles}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <NavLink to={link.path} className={linkStyles}>
                      {link.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '4',
            mt: '12',
            pt: '8',
            borderTopWidth: '1px',
            borderColor: 'white/10',
            fontSize: 'caption',
            color: 'gray.400',
          })}
        >
          <div
            className={css({
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              columnGap: '6',
              rowGap: '2',
            })}
          >
            <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
            <NavLink
              to={getLocalizedPath('/legal/confidentialite')}
              className={mutedLinkStyles}
            >
              {t('footer.legal.privacy')}
            </NavLink>
            <NavLink
              to={getLocalizedPath('/legal/cgu')}
              className={mutedLinkStyles}
            >
              {t('footer.legal.terms')}
            </NavLink>
          </div>

          <div
            className={css({ display: 'flex', alignItems: 'center', gap: '4' })}
          >
            <LanguageLinks tone="light" />
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('footer.social.linkedin')}
              className={socialStyles}
            >
              <Linkedin size={16} aria-hidden="true" />
            </a>
            <a
              href={url.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('footer.social.youtube')}
              className={socialStyles}
            >
              <Youtube size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
