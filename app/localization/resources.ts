import en_about from '../../locales/en/about.json';
import en_blog from '../../locales/en/blog.json';
import en_common from '../../locales/en/common.json';
import en_contact from '../../locales/en/contact.json';
import en_home from '../../locales/en/home.json';
import en_method from '../../locales/en/method.json';
import en_offer from '../../locales/en/offer.json';
import en_projects from '../../locales/en/projects.json';
import en_strategy from '../../locales/en/strategy.json';
import en_studio from '../../locales/en/studio.json';
import en_technology from '../../locales/en/technology.json';
import fr_about from '../../locales/fr/about.json';
import fr_blog from '../../locales/fr/blog.json';
import fr_common from '../../locales/fr/common.json';
import fr_contact from '../../locales/fr/contact.json';
import fr_home from '../../locales/fr/home.json';
import fr_method from '../../locales/fr/method.json';
import fr_offer from '../../locales/fr/offer.json';
import fr_projects from '../../locales/fr/projects.json';
import fr_strategy from '../../locales/fr/strategy.json';
import fr_studio from '../../locales/fr/studio.json';
import fr_technology from '../../locales/fr/technology.json';

export const languages = ['fr', 'en'] as const;

export const resources = {
  fr: {
    common: fr_common,
    home: fr_home,
    blog: fr_blog,
    strategy: fr_strategy,
    projects: fr_projects,
    contact: fr_contact,
    offer: fr_offer,
    method: fr_method,
    studio: fr_studio,
    technology: fr_technology,
    about: fr_about,
  },
  en: {
    common: en_common,
    home: en_home,
    blog: en_blog,
    strategy: en_strategy,
    projects: en_projects,
    contact: en_contact,
    offer: en_offer,
    method: en_method,
    studio: en_studio,
    technology: en_technology,
    about: en_about,
  },
};

export type Language = (typeof languages)[number];

export const returnLanguageIfSupported = (
  lang?: string,
): Language | undefined => {
  if (languages.includes(lang as Language)) {
    return lang as Language;
  }
  return undefined;
};
