import { CheckIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { flex, vstack } from '@ocobo/styled-system/patterns';

import { ButtonLink } from '~/components/ui/button-link';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { url } from '~/utils/url';

import type { StoryFrontmatter } from '~/types';

interface StoryDeliverablesProps {
  items: StoryFrontmatter['deliverables'];
}

const StoryDeliverables: React.FunctionComponent<StoryDeliverablesProps> = ({
  items,
}) => {
  const { t } = useTranslation();
  const getLocalizedPath = useLocalizedPathname();

  if (items.length === 0) return null;

  return (
    <div
      className={css({
        bg: 'ocobo.dark',
        p: '10',
        rounded: '3xl',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        shadow: '2xl',
      })}
    >
      <div
        className={css({
          position: 'absolute',
          top: '0',
          right: '0',
          w: '32',
          h: '32',
          bg: 'ocobo.mint/10',
          rounded: 'full',
          filter: 'blur(48px)',
          pointerEvents: 'none',
        })}
      />
      <h4
        className={css({
          fontFamily: 'display',
          fontWeight: 'black',
          fontSize: 'xs',
          textTransform: 'uppercase',
          letterSpacing: '0.4em',
          color: 'white/40',
          mb: '8',
          position: 'relative',
        })}
      >
        {t('clients.deliverables')}
      </h4>

      <ul className={vstack({ gap: '5', alignItems: 'start' })}>
        {items.map((item) => (
          <li
            key={item}
            className={`${flex({ gap: '4', align: 'start' })} ${css({
              '& .check-bg': { transition: 'colors' },
              '& .check-icon': { transition: 'colors' },
              '& span': { transition: 'colors' },
              '&:hover .check-bg': { bg: 'ocobo.mint' },
              '&:hover .check-icon': { color: 'ocobo.dark' },
              '&:hover span': { color: 'white' },
            })}`}
          >
            <div
              className={`check-bg ${css({
                mt: '1',
                bg: 'white/10',
                p: '1',
                rounded: 'sm',
                flexShrink: '0',
              })}`}
            >
              <CheckIcon
                size={12}
                className={`check-icon ${css({ color: 'ocobo.mint' })}`}
              />
            </div>
            <span
              className={css({
                fontSize: 'xs',
                fontWeight: 'bold',
                color: 'gray.300',
                lineHeight: 'snug',
              })}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>

      <div
        className={css({
          mt: '10',
          pt: '8',
          borderTopWidth: '1px',
          borderColor: 'white/10',
        })}
      >
        <p
          className={css({
            fontSize: 'xs',
            fontWeight: 'black',
            color: 'gray.400',
            textTransform: 'uppercase',
            letterSpacing: 'widest',
            mb: '4',
          })}
        >
          {t('contact.meet')}
        </p>
        <ButtonLink
          to={getLocalizedPath(url.contact)}
          variant="white"
          size="lg"
          className={css({ w: 'full' })}
        >
          {t('contact.cta')}
        </ButtonLink>
      </div>
    </div>
  );
};

StoryDeliverables.displayName = 'StoryDeliverables';

export { StoryDeliverables };
