import * as React from 'react';

import { NavLink, useLocation, useNavigation } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { flex, hstack } from '@ocobo/styled-system/patterns';

import { ButtonLink } from '~/components/ui/button-link';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { useMenuItems } from '~/hooks/useMenuItems';

import { Spinner } from '../ui/Spinner';
import { MobileMenu } from './mobile-menu';
import { NavItemWithDropdown } from './nav-item-with-dropdown';
import { SCROLL_THRESHOLD } from './styles';
import { useNavbarScroll } from './use-navbar-scroll';

const getLinkStyles = (isDropdownActive: boolean, isCurrent: boolean) =>
  cx(
    flex({ gap: '1', align: 'center' }),
    css({
      px: '4',
      py: '2',
      rounded: 'full',
      fontSize: 'sm',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all',
      transitionDuration: '300ms',
      color: isDropdownActive || isCurrent ? 'ocobo.dark' : 'gray.500',
      _hover: { color: 'ocobo.dark' },
      textDecoration: 'none',
      whiteSpace: 'nowrap',
    }),
  );

export function Navbar() {
  const navigation = useNavigation();
  const location = useLocation();
  const getLocalizedPath = useLocalizedPathname();
  const items = useMenuItems();
  const { scrollY } = useNavbarScroll();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(
    null,
  );

  const scrolled = scrollY > SCROLL_THRESHOLD;

  React.useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  return (
    <div
      className={css({
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        pointerEvents: 'none',
        p: { base: '4', lg: '6' },
      })}
    >
      <nav
        className={css({
          position: 'relative',
          w: 'full',
          maxW: scrolled ? '1024px' : '1280px',
          transition: 'all',
          transitionDuration: '700ms',
          transitionTimingFunction: 'cubic-bezier(0.23,1,0.32,1)',
          pointerEvents: 'auto',
          bg: scrolled ? 'white/90' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderWidth: scrolled ? '1px' : '0',
          borderColor: 'gray.100',
          shadow: scrolled ? 'lg' : 'none',
          rounded: scrolled ? 'full' : 'none',
          py: scrolled ? '2' : '4',
          px: scrolled ? { base: '4', lg: '6' } : { base: '4', lg: '0' },
          opacity: mobileMenuOpen ? 0 : 1,
          transform: mobileMenuOpen ? 'scale(0.95)' : 'scale(1)',
        })}
      >
        <div
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            h: '48px',
          })}
        >
          {/* Logo */}
          <NavLink
            to={getLocalizedPath('/')}
            className={css({
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            })}
          >
            <img
              src="/logo-ocobo.png"
              alt="Ocobo"
              className={css({
                transition: 'all',
                transitionDuration: '700ms',
                h: scrolled ? '28px' : '40px',
                w: 'auto',
                lg: {
                  h: scrolled ? '32px' : '46px',
                },
              })}
            />
          </NavLink>

          {navigation.state === 'loading' && (
            <Spinner
              className={css({
                color: 'gray',
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
              })}
            />
          )}

          {/* Desktop Navigation */}
          <div
            className={cx(
              hstack({ gap: '2' }),
              css({
                display: { base: 'none', lg: 'flex' },
                px: '2',
              }),
            )}
          >
            {items
              .filter((item) => !item.isButton)
              .map((item) => {
                const isCurrentPath = location.pathname === item.path;

                if (item.dropdown && item.dropdown.length > 0) {
                  return (
                    <NavItemWithDropdown
                      key={item.key}
                      item={item}
                      isCurrentPath={isCurrentPath}
                      activeDropdown={activeDropdown}
                      setActiveDropdown={setActiveDropdown}
                    />
                  );
                }

                if (item.path) {
                  return (
                    <NavLink
                      key={item.key}
                      to={item.path}
                      className={getLinkStyles(false, isCurrentPath)}
                    >
                      {item.label}
                    </NavLink>
                  );
                }

                return null;
              })}
          </div>

          {/* Right side: CTA + Mobile menu */}
          <div className={hstack({ gap: '4', flexShrink: 0 })}>
            {items
              .filter((item) => item.isButton && item.path)
              .map((item) => (
                <ButtonLink
                  key={item.key}
                  to={item.path!}
                  variant="solid"
                  size="sm"
                  className={css({
                    display: 'none',
                    lg: { display: 'flex' },
                  })}
                >
                  {item.label}
                </ButtonLink>
              ))}

            <MobileMenu
              open={mobileMenuOpen}
              onOpenChange={setMobileMenuOpen}
            />
          </div>
        </div>
      </nav>
    </div>
  );
}
