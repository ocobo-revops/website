import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { button, card, section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';
import { url } from '~/utils/url';

const cardGap = css({ gap: '3.5' });
// One static class per card. The card recipe has a dark tone; the yellow and
// sky tints stay inline, as only this section uses them.
const cardStyles = {
  podcast: cx(
    card({ padding: 'lg', border: false, shadow: 'none', tone: 'dark' }),
    cardGap,
  ),
  club: cx(
    card({ padding: 'lg', border: false, shadow: 'none' }),
    cardGap,
    css({ bg: 'yellow.light' }),
  ),
  blog: cx(
    card({ padding: 'lg', border: false, shadow: 'none' }),
    cardGap,
    css({ bg: 'sky.light' }),
  ),
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
      // The blog has no English route.
      href: url.blog,
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
              <li key={key} className={cardStyles[key]}>
                <p
                  className={text({
                    variant: 'label',
                    color: dark ? 'yellow' : 'muted',
                  })}
                >
                  {t(`share.${key}.label`)}
                </p>
                <h3
                  className={text({
                    variant: 'display-md-black',
                    color: dark ? 'white' : 'dark',
                  })}
                >
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
