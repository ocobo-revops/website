import * as React from 'react';

import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';

import type { NavItem } from '~/components/navbar/types';
import { ButtonLink } from '~/components/ui/button-link';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { useMenuItems } from '~/hooks/useMenuItems';

import { LanguageLinks } from './language-links';
import { MobileMenu } from './mobile-menu';
import { NavDisclosure } from './nav-disclosure';
import { focusRing, topLinkStyles } from './nav-styles';

export type NavbarLayout = 'auto' | 'mobile';

type NavbarBarProps = {
  /** Pill state, shown once the page has scrolled. */
  scrolled: boolean;
  /**
   * `auto` switches to the mobile layout below 1024px. `mobile` forces it
   * at any width, for the design-system preview.
   */
  layout?: NavbarLayout;
  /**
   * Entries rendered before the production menu. Reserved for the enjeu
   * entry (#237), wired when v2 is switched on (#242).
   */
  leadingItems?: NavItem[];
};

const barStyles = {
  top: css({
    maxW: '7xl',
    py: '4',
    px: { base: '4', lg: '0' },
    bg: 'transparent',
    borderColor: 'transparent',
  }),
  scrolled: css({
    maxW: '5xl',
    py: '2',
    px: '4',
    bg: 'white/95',
    backdropFilter: 'auto',
    backdropBlur: 'base',
    borderColor: 'line',
    rounded: 'full',
    shadow: 'rest',
  }),
};

const rowHeight = {
  top: css({ h: '12' }),
  scrolled: css({ h: '10' }),
};

const logoHeight = {
  autoTop: css({ h: '10', lg: { h: '11' } }),
  autoScrolled: css({ h: '7', lg: { h: '8' } }),
  mobileTop: css({ h: '10' }),
  mobileScrolled: css({ h: '7' }),
};

const desktopOnly = {
  auto: css({ display: { base: 'none', lg: 'flex' } }),
  mobile: css({ display: 'none' }),
};

const mobileOnly = {
  auto: css({ display: { base: 'flex', lg: 'none' } }),
  mobile: css({ display: 'flex' }),
};

function isWithin(pathname: string, path: string | null) {
  return !!path && (pathname === path || pathname.startsWith(`${path}/`));
}

/**
 * The v2 navbar itself, without positioning or scroll tracking, so the
 * design-system page can show each state side by side. `NavbarV2` adds the
 * fixed position and the scroll state.
 */
export function NavbarBar({
  scrolled,
  layout = 'auto',
  leadingItems = [],
}: NavbarBarProps) {
  const { t } = useTranslation('common');
  const { pathname } = useLocation();
  const getLocalizedPath = useLocalizedPathname();
  const menuItems = useMenuItems();
  const [openKey, setOpenKey] = React.useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const idPrefix = React.useId();

  React.useEffect(() => {
    setOpenKey(null);
    setMobileOpen(false);
  }, [pathname]);

  const items = [...leadingItems, ...menuItems].filter(
    (item) => !item.shouldHide,
  );
  const entries = items.filter((item) => !item.isButton);
  const cta = items.find((item) => item.isButton && item.path);
  const state = scrolled ? 'scrolled' : 'top';
  const logoKey = `${layout}${scrolled ? 'Scrolled' : 'Top'}` as const;

  return (
    <nav
      aria-label={t('navigation.label')}
      className={cx(
        css({
          position: 'relative',
          w: 'full',
          mx: 'auto',
          borderWidth: '1px',
          transition: 'all',
          transitionTimingFunction: 'smooth',
          transitionDuration: '[700ms]',
          _motionReduce: { transitionDuration: 'instant' },
        }),
        barStyles[state],
      )}
    >
      <div
        className={cx(
          css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '4',
          }),
          rowHeight[state],
        )}
      >
        <NavLink
          to={getLocalizedPath('/')}
          aria-label={t('navigation.home')}
          className={cx(
            css({ display: 'flex', flexShrink: 0, rounded: 'lg' }),
            focusRing,
          )}
        >
          <img
            src="/logo-ocobo.png"
            alt=""
            className={cx(
              css({
                w: 'auto',
                transitionProperty: 'size',
                transitionTimingFunction: 'smooth',
                transitionDuration: '[700ms]',
                _motionReduce: { transitionDuration: 'instant' },
              }),
              logoHeight[logoKey],
            )}
          />
        </NavLink>

        <ul
          className={cx(
            css({ alignItems: 'center', gap: '1' }),
            desktopOnly[layout],
          )}
        >
          {entries.map((item) => {
            const visible =
              item.dropdown?.filter((sub) => !sub.shouldHide) ?? [];
            if (visible.length > 0) {
              return (
                <li key={item.key}>
                  <NavDisclosure
                    id={`${idPrefix}-${item.key}`}
                    label={item.label}
                    items={visible}
                    isOpen={openKey === item.key}
                    isCurrent={visible.some((sub) =>
                      isWithin(pathname, sub.path),
                    )}
                    onOpenChange={(open) => setOpenKey(open ? item.key : null)}
                  />
                </li>
              );
            }
            if (!item.path) {
              return null;
            }
            if (item.isExternal) {
              return (
                <li key={item.key}>
                  <a
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={topLinkStyles}
                  >
                    {item.label}
                  </a>
                </li>
              );
            }
            return (
              <li key={item.key}>
                <NavLink to={item.path} end className={topLinkStyles}>
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>

        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            gap: '2',
            flexShrink: 0,
          })}
        >
          <LanguageLinks className={desktopOnly[layout]} />
          {cta?.path && (
            <ButtonLink
              to={cta.path}
              variant="solid"
              size="sm"
              data-testid="nav-cta"
              className={desktopOnly[layout]}
            >
              {cta.label}
            </ButtonLink>
          )}
          <MobileMenu
            items={items}
            open={mobileOpen}
            onOpenChange={setMobileOpen}
            closeOnDesktop={layout === 'auto'}
            triggerClassName={mobileOnly[layout]}
          />
        </div>
      </div>
    </nav>
  );
}
