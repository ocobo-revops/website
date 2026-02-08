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

const Aside: React.FunctionComponent<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
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
        <div className={css({ py: 4 })}>
          <p className={css({ fontWeight: 'bold', mb: '0.5rem' })}>
            {t('contact.meet')}
          </p>

          <ButtonLink to={getLocalizedPath(url.contact)}>
            {t('contact.cta')}
          </ButtonLink>
        </div>
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
