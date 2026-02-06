import {
  BookOpen,
  Briefcase,
  Cpu,
  Layers,
  Mic,
  Users,
  Youtube,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router';

import type { DropdownItem, NavItem } from '~/components/navbar/types';
import type { PageSlug } from '~/modules/feature-flags';
import type { loader as rootLoader } from '~/root';
import { url } from '~/utils/url';

import { useLocalizedPathname } from './useLocalizedPathname';

const menuKeyToSlug: Record<string, PageSlug> = {
  technology: 'technology',
  studio: 'studio',
  jobs: 'jobs',
  podcasts: 'podcasts',
  news: 'news',
  tools: 'tools',
};

export function useMenuItems(): NavItem[] {
  const { t } = useTranslation('common');
  const getLocalizedPath = useLocalizedPathname();
  const rootData = useRouteLoaderData<typeof rootLoader>('root');
  const disabledPages = rootData?.disabledPages ?? [];

  const isHidden = (key: string): boolean => {
    const slug = menuKeyToSlug[key];
    return slug !== undefined && disabledPages.includes(slug);
  };

  const methodDropdown: DropdownItem[] = [
    {
      key: 'framework',
      label: t('navigation.method.framework'),
      description: t('navigation.method.framework.description'),
      path: getLocalizedPath(url.method),
      icon: Layers,
      color: 'yellow',
    },
    {
      key: 'technology',
      label: t('navigation.method.technology'),
      description: t('navigation.method.technology.description'),
      path: getLocalizedPath(url.technology),
      icon: Cpu,
      color: 'sky',
      shouldHide: isHidden('technology'),
    },
    {
      key: 'studio',
      label: t('navigation.method.studio'),
      description: t('navigation.method.studio.description'),
      path: getLocalizedPath(url.studio),
      icon: Briefcase,
      color: 'mint',
      shouldHide: isHidden('studio'),
    },
  ];

  const companyDropdown: DropdownItem[] = [
    {
      key: 'about',
      label: t('navigation.company.about'),
      description: t('navigation.company.about.description'),
      path: getLocalizedPath(url.aboutUs),
      icon: Users,
      color: 'coral',
    },
    {
      key: 'jobs',
      label: t('navigation.company.jobs'),
      description: t('navigation.company.jobs.description'),
      path: url.careers,
      icon: Briefcase,
      color: 'coral',
      isExternal: true,
      shouldHide: isHidden('jobs'),
    },
  ];

  const resourcesDropdown: DropdownItem[] = [
    {
      key: 'podcasts',
      label: t('navigation.resources.podcasts'),
      description: t('navigation.resources.podcasts.description'),
      path: url.podcasts,
      icon: Mic,
      color: 'yellow',
      isExternal: true,
      shouldHide: isHidden('podcasts'),
    },
    {
      key: 'youtube',
      label: t('navigation.resources.youtube'),
      description: t('navigation.resources.youtube.description'),
      path: url.youtube,
      icon: Youtube,
      color: 'coral',
      isExternal: true,
    },
    {
      key: 'blog',
      label: t('navigation.resources.blog'),
      description: t('navigation.resources.blog.description'),
      path: url.blog,
      icon: BookOpen,
      color: 'sky',
    },
    {
      key: 'club',
      label: t('navigation.resources.club'),
      description: t('navigation.resources.club.description'),
      path: url.modernRevenueClub,
      imageSrc: '/images/partners/modern-revenue-club.png',
      color: 'sky',
      isExternal: true,
    },
  ];

  return [
    {
      key: 'offer',
      label: t('navigation.offer'),
      path: getLocalizedPath(url.offer),
    },
    {
      key: 'method',
      label: t('navigation.method.title'),
      path: null,
      dropdown: methodDropdown,
    },
    {
      key: 'stories',
      label: t('navigation.stories'),
      path: url.stories,
    },
    {
      key: 'company',
      label: t('navigation.company.title'),
      path: null,
      dropdown: companyDropdown,
    },
    {
      key: 'resources',
      label: t('navigation.resources.title'),
      path: null,
      dropdown: resourcesDropdown,
    },
    {
      key: 'contact',
      label: t('contact.cta'),
      path: getLocalizedPath(url.contact),
      isButton: true,
    },
  ];
}
