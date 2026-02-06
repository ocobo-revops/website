import { ArrowRight, Linkedin, Youtube } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation, useParams } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import {
  center,
  flex,
  grid,
  hstack,
  vstack,
} from '@ocobo/styled-system/patterns';

import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { useMenuItems } from '~/hooks/useMenuItems';
import { languages } from '~/localization/resources';
import { getLang } from '~/utils/lang';
import { url } from '~/utils/url';

import { NewsletterForm } from './NewsletterForm';
import { Logocobo } from './ui/Logocobo';

const sectionTitleStyles = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  mb: '6',
  color: 'gray.400',
  fontSize: 'sm',
  textTransform: 'uppercase',
  letterSpacing: 'wider',
});

const linkStyles = css({
  transition: 'colors',
  _hover: { color: 'ocobo.yellow' },
});

const socialButtonStyles = cx(
  center(),
  css({
    w: '8',
    h: '8',
    rounded: 'full',
    bg: 'gray.800',
    transition: 'all',
    transitionDuration: '300ms',
    _hover: { bg: 'white', color: 'ocobo.dark' },
  }),
);

type FooterLinkItem = {
  label: string;
  path: string;
  isExternal?: boolean;
};

function FooterLinkList({ items }: { items: FooterLinkItem[] }) {
  return (
    <ul className={css({ spaceY: '3', fontSize: 'sm', color: 'gray.300' })}>
      {items.map(({ label, path, isExternal }) => (
        <li key={label}>
          {isExternal ? (
            <a
              href={path}
              target="_blank"
              rel="noopener noreferrer"
              className={linkStyles}
            >
              {label}
            </a>
          ) : (
            <NavLink to={path} className={linkStyles}>
              {label}
            </NavLink>
          )}
        </li>
      ))}
    </ul>
  );
}

function Footer() {
  const { t } = useTranslation('common');
  const items = useMenuItems();
  const getLocalizedPath = useLocalizedPathname();
  const { pathname } = useLocation();
  const params = useParams();
  const currentLang = getLang(params);

  const companyItems: FooterLinkItem[] =
    items
      ?.find((item) => item.key === 'company')
      ?.dropdown?.filter((item) => !item.shouldHide)
      ?.map((item) => ({
        label: item.label,
        path: item.path,
        isExternal: item.isExternal,
      })) ?? [];

  const methodItems: FooterLinkItem[] =
    items
      ?.find((item) => item.key === 'method')
      ?.dropdown?.filter((item) => !item.shouldHide)
      ?.map((item) => ({
        label: item.label,
        path: item.path,
        isExternal: item.isExternal,
      })) ?? [];

  return (
    <footer
      className={css({
        bg: 'ocobo.dark',
        color: 'white',
        pt: '20',
        pb: '10',
      })}
    >
      <div
        className={css({
          maxW: '7xl',
          mx: 'auto',
          px: { base: '4', sm: '6', lg: '8' },
        })}
      >
        {/* Top section */}
        <div
          className={cx(
            grid({ columns: { base: 1, md: 2, lg: 4 }, gap: '12' }),
            css({
              mb: '20',
              borderBottomWidth: '1px',
              borderColor: 'gray.800',
              pb: '12',
            }),
          )}
        >
          {/* Brand & Social */}
          <div
            className={cx(
              flex({ direction: 'column', gap: '6' }),
              css({ alignItems: 'flex-start' }),
            )}
          >
            <Logocobo
              height="40"
              className={css({ color: 'white', w: 'auto' })}
            />

            <div className={hstack({ gap: '4' })}>
              <a
                href="https://www.linkedin.com/company/ocobofr/"
                target="_blank"
                rel="noopener noreferrer"
                className={socialButtonStyles}
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href={url.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className={socialButtonStyles}
                aria-label="YouTube"
              >
                <Youtube size={16} />
              </a>
            </div>

            <NavLink
              to={getLocalizedPath(url.contact)}
              className={css({
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2',
                fontSize: 'xs',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: 'widest',
                borderWidth: '1px',
                borderColor: 'white/30',
                rounded: 'full',
                px: '6',
                py: '3',
                transition: 'all',
                _hover: { bg: 'white', color: 'ocobo.dark' },
              })}
            >
              {t('contact.cta')}
              <ArrowRight size={12} />
            </NavLink>
          </div>

          {/* Company links */}
          <div>
            <h4 className={sectionTitleStyles}>{t('footer.company.title')}</h4>
            <FooterLinkList items={companyItems} />
          </div>

          {/* Method links */}
          <div>
            <h4 className={sectionTitleStyles}>{t('footer.method.title')}</h4>
            <FooterLinkList items={methodItems} />
          </div>

          {/* Newsletter */}
          <div className={vstack({ gap: '6', alignItems: 'stretch' })}>
            <h4 className={sectionTitleStyles}>
              {t('footer.newsletter.title')}
            </h4>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom section */}
        <div
          className={cx(
            flex({
              direction: { base: 'column', md: 'row' },
              justify: 'space-between',
              align: 'center',
            }),
            css({ fontSize: 'xs', color: 'gray.500' }),
          )}
        >
          <div
            className={cx(
              flex({ align: 'center', gap: '6' }),
              css({ mt: { base: '4', md: '0' } }),
            )}
          >
            <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
            <span className={css({ color: 'gray.700' })}>|</span>
            {languages.map((lng) => (
              <NavLink
                key={lng}
                to={pathname.replace(`/${currentLang}`, `/${lng}`)}
                className={css({
                  transition: 'colors',
                  textTransform: 'uppercase',
                  fontWeight: currentLang === lng ? 'bold' : 'normal',
                  color: currentLang === lng ? 'white' : 'gray.500',
                  _hover: { color: 'white' },
                })}
              >
                {lng}
              </NavLink>
            ))}
          </div>
          <div
            className={cx(
              flex({ gap: '6' }),
              css({ mt: { base: '4', md: '0' }, pr: '16' }),
            )}
          >
            <NavLink
              to={getLocalizedPath('/legal/confidentialite')}
              className={css({
                transition: 'colors',
                _hover: { color: 'white' },
              })}
            >
              {t('footer.legal.privacy')}
            </NavLink>
            <NavLink
              to={getLocalizedPath('/legal/cgu')}
              className={css({
                transition: 'colors',
                _hover: { color: 'white' },
              })}
            >
              {t('footer.legal.terms')}
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
