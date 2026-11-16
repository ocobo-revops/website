import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { button, card, section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { url } from '~/utils/url';

const cardStyle = cx(
  card({ padding: 'lg', border: false, shadow: 'none' }),
  css({ gap: '3.5' }),
);
// The card recipe has no dark, yellow or sky tone yet: one static class per
// card until it gets a tone variant (PR #332, open question on the dark tone).
const toneStyles = {
  podcast: css({ bg: 'dark', color: 'white' }),
  club: css({ bg: 'yellow.light' }),
  blog: css({ bg: 'sky.light' }),
} as const;
const linkStyle = cx(
  button({ variant: 'link' }),
  // Reads the card text colour, white on the dark card.
  css({ color: '[inherit]', mt: 'auto', pt: '4', alignSelf: 'flex-start' }),
);
const srOnly = css({ srOnly: true });

/** Podcast, club and blog: what the team shares (`#partage`). */
export function ShareSection() {
  const { t } = useTranslation(['studio', 'common']);
  const getLocalizedPath = useLocalizedPathname();

  const items = [
    {
      key: 'podcast',
      title: t('common:navigation.resources.podcasts'),
      description: t('common:navigation.resources.podcasts.description'),
      href: url.podcasts,
      external: true,
      dark: true,
    },
    {
      key: 'club',
      title: t('common:navigation.resources.club'),
      description: t('common:navigation.resources.club.description'),
      href: url.modernRevenueClub,
      external: true,
      dark: false,
    },
    {
      key: 'blog',
      title: t('common:navigation.resources.blog'),
      description: t('common:navigation.resources.blog.description'),
      href: getLocalizedPath(url.blog),
      external: false,
      dark: false,
    },
  ] as const;

  return (
    <section
      id="partage"
      className={cx(section({ bg: 'white' }), css({ scrollMarginTop: '24' }))}
    >
      <Container>
        <div
          className={css({
            maxW: '3xl',
            mx: 'auto',
            mb: '16',
            textAlign: 'center',
          })}
        >
          <h2 className={cx(text({ variant: 'display-lg' }), css({ mb: '5' }))}>
            {t('share.title')}
          </h2>
          <p className={text({ variant: 'body', color: 'muted' })}>
            {t('share.subtitle')}
          </p>
        </div>

        <ul
          className={css({
            display: 'grid',
            gridTemplateColumns: {
              base: '1fr',
              md: 'repeat(3, minmax(0, 1fr))',
            },
            gap: '6',
          })}
        >
          {items.map(({ key, title, description, href, external, dark }) => {
            const cta = (
              <>
                {t(`share.${key}.cta`)}
                <span className={srOnly}> {title}</span>
                <ArrowRight size={16} aria-hidden="true" />
              </>
            );
            return (
              <li key={key} className={cx(cardStyle, toneStyles[key])}>
                <p
                  className={text({
                    variant: 'label',
                    color: dark ? 'yellow' : 'muted',
                  })}
                >
                  {t(`share.${key}.label`)}
                </p>
                <h3 className={text({ variant: 'display-md-black' })}>
                  {title}
                </h3>
                <p
                  className={text({
                    variant: 'body',
                    color: dark ? 'muted-light' : 'muted',
                  })}
                >
                  {description}
                </p>
                {external ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkStyle}
                  >
                    {cta}
                  </a>
                ) : (
                  <Link to={href} className={linkStyle}>
                    {cta}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
