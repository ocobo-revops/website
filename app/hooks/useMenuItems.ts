import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router';

import { button } from '@ocobo/styled-system/recipes';

import { SubMenu } from '~/components/SubMenu';
import type { PageSlug } from '~/modules/feature-flags';
import type { loader as rootLoader } from '~/root';
import { url } from '~/utils/url';

import { useLocalizedPathname } from './useLocalizedPathname';

type SubMenuItem = {
  key: string;
  title: string;
  url: string;
  variant: React.ComponentProps<typeof SubMenu.Item>['variant'];
  shouldHide?: boolean;
};

type MenuItem = {
  key: string;
  title: string;
  url: string | null;
  subItems?: SubMenuItem[];
  shouldHide?: boolean;
  className?: string;
};

/** Map menu item keys to feature flag slugs where applicable */
const menuKeyToSlug: Record<string, PageSlug> = {
  news: 'news',
  tools: 'tools',
  podcasts: 'podcasts',
  jobs: 'jobs',
};

export const useMenuItems = (): MenuItem[] => {
  const { t } = useTranslation('common');
  const getLocalizedPath = useLocalizedPathname();
  const rootData = useRouteLoaderData<typeof rootLoader>('root');
  const disabledPages = rootData?.disabledPages ?? [];

  const isHidden = (key: string): boolean => {
    const slug = menuKeyToSlug[key];
    return slug !== undefined && disabledPages.includes(slug);
  };

  return [
    {
      key: 'services',
      title: t('navigation.services.title'),
      url: null,
      subItems: [
        {
          key: 'strategy',
          title: t('navigation.services.strategy'),
          url: getLocalizedPath(url.strategy),
          variant: 'yellow',
        },
        {
          key: 'revops',
          title: t('navigation.services.revops'),
          url: getLocalizedPath(url.projects),
          variant: 'sky',
        },
      ],
    },
    {
      key: 'stories',
      title: t('navigation.stories'),
      url: url.stories,
    },
    {
      key: 'company',
      title: t('navigation.company.title'),
      url: null,
      subItems: [
        {
          key: 'about',
          title: t('navigation.company.about'),
          url: url.about,
          variant: 'coral',
        },
        {
          key: 'careers',
          title: t('navigation.company.jobs'),
          url: url.careers,
          variant: 'coral',
        },
      ],
    },
    {
      key: 'resources',
      title: t('navigation.resources.title'),
      url: null,
      subItems: [
        {
          key: 'news',
          title: t('navigation.resources.news'),
          url: url.news,
          variant: 'mint',
          shouldHide: isHidden('news'),
        },
        {
          key: 'podcasts',
          title: t('navigation.resources.podcasts'),
          url: url.podcasts,
          variant: 'mint',
          shouldHide: isHidden('podcasts'),
        },
        {
          key: 'webinars',
          title: t('navigation.resources.webinars'),
          url: 'https://app.getcontrast.io/ocobo',
          variant: 'mint',
        },
        {
          key: 'blog',
          title: t('navigation.resources.blog'),
          url: url.blog,
          variant: 'mint',
        },
        {
          key: 'tools',
          title: t('navigation.resources.tools'),
          url: url.tools,
          variant: 'mint',
          shouldHide: isHidden('tools'),
        },
      ],
    },
    {
      key: 'contact',
      title: t('contact.cta'),
      url: getLocalizedPath(url.contact),
      className: button({ variant: 'solid' }),
    },
  ];
};
