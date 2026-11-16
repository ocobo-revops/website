import { ArrowRight, BookOpen, Mic, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import {
  button,
  card,
  iconBox,
  section,
  text,
} from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { url } from '~/utils/url';

const cardStyle = cx(card({ padding: 'lg' }), css({ gap: '4' }));
const linkStyle = cx(
  button({ variant: 'link' }),
  css({ mt: 'auto', alignSelf: 'flex-start' }),
);
const srOnly = css({ srOnly: true });
const iconStyle = iconBox({ size: 'xl', variant: 'solid', color: 'yellow' });

/** Podcast, club and blog: what the team shares (`#partage`). */
export function ShareSection() {
  const { t } = useTranslation(['studio', 'common']);
  const getLocalizedPath = useLocalizedPathname();

  const items = [
    {
      key: 'podcast',
      icon: Mic,
      title: t('common:navigation.resources.podcasts'),
      description: t('common:navigation.resources.podcasts.description'),
      href: url.podcasts,
      external: true,
    },
    {
      key: 'club',
      icon: Users,
      title: t('common:navigation.resources.club'),
      description: t('common:navigation.resources.club.description'),
      href: url.modernRevenueClub,
      external: true,
    },
    {
      key: 'blog',
      icon: BookOpen,
      title: t('common:navigation.resources.blog'),
      description: t('common:navigation.resources.blog.description'),
      href: getLocalizedPath(url.blog),
      external: false,
    },
  ] as const;

  return (
    <section
      id="partage"
      className={cx(section({ bg: 'white' }), css({ scrollMarginTop: '24' }))}
    >
      <Container>
        <div className={css({ maxW: '3xl', mb: '14' })}>
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
          {items.map(
            ({ key, icon: Icon, title, description, href, external }) => {
              const cta = (
                <>
                  {t(`share.${key}.cta`)}
                  <span className={srOnly}> {title}</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </>
              );
              return (
                <li key={key} className={cardStyle}>
                  <span className={iconStyle}>
                    <Icon size={26} aria-hidden="true" />
                  </span>
                  <p className={text({ variant: 'label', color: 'muted' })}>
                    {t(`share.${key}.label`)}
                  </p>
                  <h3 className={text({ variant: 'display-md-bold' })}>
                    {title}
                  </h3>
                  <p className={text({ variant: 'body', color: 'muted' })}>
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
            },
          )}
        </ul>
      </Container>
    </section>
  );
}
