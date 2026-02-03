import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { Flex, Grid, GridItem, styled } from '@ocobo/styled-system/jsx';
import { flex } from '@ocobo/styled-system/patterns';
import { button, icon } from '@ocobo/styled-system/recipes';

import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { useMenuItems } from '~/hooks/useMenuItems';
import { url } from '~/utils/url';

import { LanguageSwitcher } from './LanguageSwitcher';
import { NewsletterForm } from './NewsletterForm';
import { Container } from './ui/Container';
import { Logocobo } from './ui/Logocobo';

const Title = styled('p', {
  base: {
    textStyle: 'nav',
    mb: '3',
  },
});

type TItem = {
  label: string;
  path: string;
};

const FooterMenu: React.FunctionComponent<{
  title: string;
  items: Array<TItem>;
}> = ({ title, items }) => {
  return (
    <div className={css({})}>
      <Title>{title}</Title>
      <ul className={css({ textStyle: 'nav' })}>
        {items.map(({ label, path }) => (
          <li key={label} className={css({ mb: '3' })}>
            <NavLink
              to={path}
              className={css({
                color: 'white/60',
                textDecoration: 'none',
                position: 'relative',

                _hover: {
                  color: 'white',
                },
              })}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Socials = () => {
  return (
    <ul className={flex({ gap: '4', alignContent: 'center', py: '4' })}>
      <li>
        <a href="https://fr.linkedin.com/company/ocobofr">
          <svg
            className={icon({ size: 'lg' })}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M21.959 13.7189V21.0979H17.681V14.2129C17.681 12.4829 17.062 11.3029 15.514 11.3029C14.332 11.3029 13.628 12.0989 13.319 12.8679C13.206 13.1429 13.177 13.5259 13.177 13.9109V21.0979H8.897C8.897 21.0979 8.955 9.43788 8.897 8.22888H13.177V10.0529L13.149 10.0949H13.177V10.0529C13.745 9.17788 14.76 7.92688 17.033 7.92688C19.848 7.92688 21.959 9.76688 21.959 13.7189ZM4.421 2.02588C2.958 2.02588 2 2.98588 2 4.24888C2 5.48388 2.93 6.47288 4.365 6.47288H4.393C5.886 6.47288 6.813 5.48388 6.813 4.24888C6.787 2.98588 5.886 2.02588 4.421 2.02588ZM2.254 21.0979H6.532V8.22888H2.254V21.0979Z" />
          </svg>
        </a>
      </li>
      {/* <li>
        <svg
          className={icon({ size: 'lg' })}
          width="25"
          height="19"
          viewBox="0 0 25 19"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.91875 12.4914V5.30102L16.6729 8.90849L9.91875 12.4914ZM24.75 4.05446C24.75 4.05446 24.5052 2.29071 23.7562 1.51441C22.8052 0.494979 21.7396 0.490714 21.251 0.430998C17.7531 0.171875 12.5052 0.171875 12.5052 0.171875H12.4948C12.4948 0.171875 7.24687 0.171875 3.74896 0.430998C3.25937 0.489648 2.19479 0.494979 1.24271 1.51441C0.49375 2.29071 0.25 4.05446 0.25 4.05446C0.25 4.05446 0 6.12638 0 8.19616V10.1391C0 12.2099 0.25 14.2808 0.25 14.2808C0.25 14.2808 0.49375 16.0434 1.24271 16.8208C2.19479 17.8402 3.44375 17.8083 4 17.9149C6 18.1111 12.5 18.1719 12.5 18.1719C12.5 18.1719 17.7531 18.1644 21.251 17.9053C21.7406 17.8456 22.8052 17.8402 23.7562 16.8208C24.5062 16.0434 24.75 14.2808 24.75 14.2808C24.75 14.2808 25 12.2099 25 10.138V8.19723C25 6.12638 24.75 4.05446 24.75 4.05446Z"
          />
        </svg>
      </li>
      <li>
        <svg
          className={icon({ size: 'lg' })}
          width="18"
          height="19"
          viewBox="0 0 18 19"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.94663 3.08619C6.45353 2.0829 8.27903 1.67424 10.0699 1.93931C11.8607 2.20437 13.4896 3.1243 14.6412 4.52108C15.7929 5.91787 16.3855 7.6922 16.3044 9.50072C16.2232 11.3092 15.4741 13.0234 14.202 14.3114C14.049 14.4715 13.965 14.6852 13.9682 14.9066C13.9713 15.128 14.0614 15.3392 14.2189 15.4948C14.3764 15.6504 14.5887 15.7379 14.8101 15.7383C15.0315 15.7387 15.2442 15.6521 15.4024 15.4972C16.6501 14.2342 17.4965 12.6304 17.835 10.8876C18.1734 9.14475 17.9888 7.34075 17.3045 5.70257C16.6201 4.06438 15.4665 2.66521 13.9888 1.68109C12.5111 0.69697 10.7754 0.171875 9 0.171875C7.22461 0.171875 5.48888 0.69697 4.0112 1.68109C2.53353 2.66521 1.37993 4.06438 0.695553 5.70257C0.0111777 7.34075 -0.173396 9.14475 0.165055 10.8876C0.503506 12.6304 1.34986 14.2342 2.59763 15.4972C2.675 15.5781 2.76771 15.6428 2.87034 15.6875C2.97297 15.7323 3.08348 15.7561 3.19543 15.7577C3.30737 15.7593 3.41852 15.7386 3.52238 15.6968C3.62625 15.6551 3.72076 15.593 3.80041 15.5143C3.88006 15.4357 3.94326 15.3419 3.98631 15.2386C4.02937 15.1352 4.05143 15.0243 4.05121 14.9124C4.05098 14.8004 4.02848 14.6896 3.98501 14.5865C3.94154 14.4833 3.87797 14.3898 3.798 14.3114C3.04012 13.5442 2.4613 12.6189 2.10302 11.6018C1.74475 10.5846 1.61588 9.5008 1.72565 8.42799C1.83543 7.35518 2.18113 6.31993 2.73799 5.39642C3.29484 4.4729 4.04907 3.68398 4.94663 3.08619ZM9 5.23494C9.77523 5.23504 10.5332 5.46399 11.1788 5.89307C11.8245 6.32216 12.3291 6.93229 12.6295 7.64697C12.9298 8.36166 13.0125 9.14911 12.8672 9.91059C12.7218 10.6721 12.3549 11.3737 11.8125 11.9276C11.7349 12.0068 11.6737 12.1004 11.6324 12.2033C11.591 12.3061 11.5703 12.4161 11.5715 12.5269C11.5726 12.6378 11.5956 12.7473 11.6391 12.8493C11.6826 12.9512 11.7457 13.0436 11.8249 13.1212C11.9041 13.1988 11.9978 13.26 12.1006 13.3013C12.2034 13.3427 12.3134 13.3634 12.4243 13.3622C12.5351 13.3611 12.6446 13.3381 12.7466 13.2946C12.8485 13.2511 12.9409 13.188 13.0185 13.1088C13.7935 12.3176 14.3177 11.3152 14.5253 10.2272C14.7329 9.13932 14.6147 8.01432 14.1856 6.99328C13.7565 5.97225 13.0354 5.10062 12.113 4.48769C11.1905 3.87475 10.1076 3.54779 9 3.54779C7.89245 3.54779 6.80954 3.87475 5.88705 4.48769C4.96457 5.10062 4.24355 5.97225 3.81441 6.99328C3.38527 8.01432 3.2671 9.13932 3.47472 10.2272C3.68234 11.3152 4.20651 12.3176 4.9815 13.1088C5.13876 13.2652 5.35128 13.3534 5.57307 13.3543C5.79486 13.3552 6.00808 13.2687 6.16661 13.1136C6.32513 12.9585 6.4162 12.7472 6.42011 12.5254C6.42402 12.3037 6.34046 12.0893 6.1875 11.9287C5.64468 11.3749 5.27747 10.6732 5.13192 9.91148C4.98637 9.1498 5.06897 8.36211 5.36935 7.64719C5.66974 6.93228 6.17454 6.32197 6.82043 5.89283C7.46632 5.4637 8.22455 5.23483 9 5.23494ZM11.25 9.17244C11.25 9.76918 11.013 10.3415 10.591 10.7634C10.169 11.1854 9.59674 11.4224 9 11.4224C8.40327 11.4224 7.83097 11.1854 7.40901 10.7634C6.98706 10.3415 6.75 9.76918 6.75 9.17244C6.75 8.5757 6.98706 8.00341 7.40901 7.58145C7.83097 7.15949 8.40327 6.92244 9 6.92244C9.59674 6.92244 10.169 7.15949 10.591 7.58145C11.013 8.00341 11.25 8.5757 11.25 9.17244ZM9.84375 13.9537C9.84375 13.7299 9.75486 13.5153 9.59663 13.3571C9.43839 13.1988 9.22378 13.1099 9 13.1099C8.77623 13.1099 8.56162 13.1988 8.40338 13.3571C8.24515 13.5153 8.15625 13.7299 8.15625 13.9537V17.3287C8.15625 17.5525 8.24515 17.7671 8.40338 17.9253C8.56162 18.0835 8.77623 18.1724 9 18.1724C9.22378 18.1724 9.43839 18.0835 9.59663 17.9253C9.75486 17.7671 9.84375 17.5525 9.84375 17.3287V13.9537Z"
          />
        </svg>
      </li> */}
    </ul>
  );
};

const Footer = () => {
  const { t } = useTranslation('common');
  const items = useMenuItems();
  const getLocalizedPath = useLocalizedPathname();

  const company =
    items
      ?.find((item) => item.key === 'company')
      ?.dropdown?.filter((item) => !item.shouldHide)
      ?.map((item) => ({
        label: item.label,
        path: item.path,
      })) ?? [];

  const services =
    items
      ?.find((item) => item.key === 'services')
      ?.dropdown?.filter((item) => !item.shouldHide)
      ?.map((item) => ({
        label: item.label,
        path: item.path,
      })) ?? [];

  const resources =
    items
      ?.find((item) => item.key === 'resources')
      ?.dropdown?.filter((item) => !item.shouldHide)
      ?.map((item) => ({
        label: item.label,
        path: item.path,
      })) ?? [];

  const stories = items?.find((item) => item.key === 'stories');

  return (
    <footer>
      <div
        className={cx(
          'dark',
          css({
            backgroundColor: 'background',
            color: 'foreground',
            py: '2.5em',
          }),
        )}
      >
        <Container isMobileFullWidth>
          <Grid columns={{ base: 2, lg: 12 }}>
            <GridItem
              colSpan={{ base: 2, lg: 3 }}
              className={css({
                display: 'flex',
                flexDirection: 'column',
                alignItems: { base: 'center', lg: 'start' },
                pb: '2.5em',
              })}
            >
              <Logocobo height="46" className={css({ fill: 'current' })} />
              <Socials />
              <NavLink to={getLocalizedPath(url.contact)} className={button()}>
                {t('contact.cta')}
              </NavLink>
            </GridItem>

            <GridItem
              colSpan={{ base: 1, lg: 2 }}
              css={{ px: { base: 4, lg: 0 } }}
            >
              <FooterMenu title={t('footer.company.title')} items={company} />
            </GridItem>

            <GridItem
              colSpan={{ base: 1, lg: 2 }}
              css={{ px: { base: 4, lg: 0 } }}
            >
              <FooterMenu title={t('footer.services.title')} items={services} />
            </GridItem>

            <GridItem
              colSpan={{ base: 1, lg: 2 }}
              css={{ px: { base: 4, lg: 0 } }}
            >
              <div>
                <Title>{t('footer.resources.title')}</Title>
                <ul className={css({ textStyle: 'nav' })}>
                  {stories && (
                    <li className={css({ mb: '3' })}>
                      <NavLink
                        to={url.stories}
                        className={css({
                          color: 'white/60',
                          textDecoration: 'none',
                          position: 'relative',

                          _hover: {
                            color: 'white',
                          },
                        })}
                      >
                        {stories.label}
                      </NavLink>
                    </li>
                  )}
                  {resources.map(({ label, path }) => (
                    <li key={label} className={css({ mb: '3' })}>
                      <NavLink
                        to={path}
                        className={css({
                          color: 'white/60',
                          textDecoration: 'none',
                          position: 'relative',

                          _hover: {
                            color: 'white',
                          },
                        })}
                      >
                        {label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </GridItem>
            <GridItem
              colSpan={{ base: 2, lg: 3 }}
              css={{ mt: { base: '6', lg: 0 } }}
            >
              <Title>{t('footer.newsletter.title')}</Title>
              <NewsletterForm className={css({ mb: '6' })} />
              <div
                className={flex({
                  justifyContent: { base: 'center', lg: 'end' },
                })}
              >
                <LanguageSwitcher />
              </div>
            </GridItem>
          </Grid>
        </Container>
      </div>

      <Container>
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          gap={4}
          className={css({
            minHeight: '5em',
            alignItems: 'center',
            py: '4',
            textStyle: 'nav',
          })}
        >
          <div>
            {t('footer.copyright', {
              ns: 'common',
              year: new Date().getFullYear(),
            })}
          </div>
          <div>
            <NavLink to="/legal/confidentialite">Confidentialité</NavLink>
          </div>
          <div>
            <NavLink to="/legal/cgu">Conditions d&apos;utilisations</NavLink>
          </div>
        </Flex>
      </Container>
    </footer>
  );
};

export { Footer };
