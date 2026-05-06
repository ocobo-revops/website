import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { styled } from '@ocobo/styled-system/jsx';

import { ButtonLink } from '~/components/ui/button-link';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { url } from '~/utils/url';

const desktopTemplateAreas =
  '"aside aside aside . main main main main main main main main"';
const mobileTemplateAreas = '"main" "aside"';

const Root = styled('article', {
  base: {
    display: 'grid',
    gridTemplateColumns: { base: '1fr', lg: 'repeat(12, 1fr)' },
    gap: '4',
    gridTemplateAreas: {
      base: mobileTemplateAreas,
      lg: desktopTemplateAreas,
    },
    position: 'relative',
    py: '16',
  },
});

const AsideWrapper = styled('aside', {
  base: {
    gridArea: 'aside',
  },
});

const Aside: React.FunctionComponent<
  React.PropsWithChildren<{ hideCta?: boolean }>
> = ({ children, hideCta = false }) => {
  const { t } = useTranslation();
  const getLocalizedPath = useLocalizedPathname();
  return (
    <AsideWrapper>
      <div
        className={css({
          position: { base: 'static', lg: 'sticky' },
          top: {
            base: 'var(--main-header-height-mobile)',
            lg: 'var(--main-header-height)',
          },
        })}
      >
        {children}
        {!hideCta && (
          <div
            className={css({
              mt: '10',
              p: '8',
              bg: 'ocobo.dark',
              rounded: '2xl',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            })}
          >
            <div
              className={css({
                position: 'absolute',
                top: '0',
                right: '0',
                w: '24',
                h: '24',
                bg: 'ocobo.yellow/10',
                rounded: 'full',
                filter: 'blur(32px)',
                pointerEvents: 'none',
              })}
            />
            <p
              className={css({
                fontFamily: 'display',
                fontSize: 'lg',
                fontWeight: 'bold',
                mb: '4',
              })}
            >
              {t('contact.sidebar.title')}
            </p>
            <p
              className={css({
                fontSize: 'xs',
                color: 'gray.400',
                mb: '6',
                lineHeight: 'relaxed',
              })}
            >
              {t('contact.sidebar.description')}
            </p>
            <ButtonLink
              to={getLocalizedPath(url.contact)}
              variant="yellow"
              className={css({ w: 'full', justifyContent: 'center' })}
            >
              {t('contact.sidebar.cta')}
            </ButtonLink>
          </div>
        )}
      </div>
    </AsideWrapper>
  );
};

const Main = styled('main', {
  base: {
    gridArea: 'main',
    position: 'relative',
  },
});

export const LayoutPost = { Root, Aside, Main };
