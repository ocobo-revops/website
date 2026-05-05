import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';

import { ButtonLink } from '~/components/ui/button-link';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { url } from '~/utils/url';

const StoryCtaBlock: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const getLocalizedPath = useLocalizedPathname();

  return (
    <div
      className={css({
        bg: 'ocobo.yellow',
        p: { base: '12', md: '24' },
        rounded: '3xl',
        textAlign: 'center',
        color: 'ocobo.dark',
        position: 'relative',
        overflow: 'hidden',
        mt: '32',
        mb: '16',
      })}
    >
      <div
        className={css({
          position: 'absolute',
          inset: '0',
          opacity: 0.1,
          backgroundImage: 'radial-gradient(#212323 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          pointerEvents: 'none',
        })}
      />
      <div
        className={css({
          position: 'relative',
          zIndex: 10,
          maxW: '3xl',
          mx: 'auto',
        })}
      >
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'black',
            fontSize: 'xs',
            textTransform: 'uppercase',
            letterSpacing: '0.4em',
            mb: '8',
            display: 'inline-block',
            opacity: 0.4,
          })}
        >
          {t('clients.cta.eyebrow')}
        </span>
        <h2
          className={css({
            fontFamily: 'display',
            fontSize: { base: '4xl', md: '6xl' },
            fontWeight: 'black',
            mb: '10',
            lineHeight: 'tight',
            letterSpacing: 'tight',
          })}
        >
          {t('clients.cta.title')}
        </h2>
        <div className={flex({ justify: 'center' })}>
          <ButtonLink
            to={getLocalizedPath(url.contact)}
            variant="solid"
            size="lg"
            className={css({
              shadow: '2xl',
              transition: 'transform',
              _hover: { transform: 'scale(1.05)' },
            })}
          >
            {t('clients.cta.button')}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
};

StoryCtaBlock.displayName = 'StoryCtaBlock';

export { StoryCtaBlock };
