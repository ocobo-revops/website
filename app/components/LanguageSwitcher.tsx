import { createListCollection } from '@ark-ui/react/select';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';

import { css } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';

import { supportedLngs } from '~/localization/i18n';
import { getLang } from '~/utils/lang';

import { Select } from './ui/Select';

const Flag: React.FunctionComponent<{
  lang?: 'en' | 'fr';
}> = (props) => {
  switch (props.lang) {
    case 'en':
      return (
        <svg
          width="17"
          height="12"
          viewBox="0 0 17 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17 0H0V12H17V0Z" fill="#012169" />
          <path
            d="M15.0078 0L8.52656 4.525L2.07188 0H0V1.55L6.375 6.025L0 10.475V12H2.125L8.5 7.525L14.8484 12H17V10.5L10.6516 6.05L17 1.6V0H15.0078Z"
            fill="white"
          />
          <path
            d="M5.7375 7.025L0 11V12L7.19844 7.025H5.7375ZM10.625 7.525L10.4656 8.4L15.5656 12H17L10.625 7.525ZM0 0V0.075L6.61406 4.775L6.56094 3.675L1.32812 0H0ZM17 0L10.6516 4.4H12.2453L17 1.05V0Z"
            fill="#C8102E"
          />
          <path
            d="M10.5984 0V12H6.34844V0H10.5984ZM17 4V8H0V4H17Z"
            fill="white"
          />
          <path
            d="M17 4.825V7.225H0V4.825H17ZM9.74844 0V12H7.19844V0H9.74844Z"
            fill="#C8102E"
          />
        </svg>
      );

    case 'fr':
    default:
      return (
        <svg
          width="17"
          height="13"
          viewBox="0 0 17 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0H17V13H0V0Z" fill="white" />
          <path d="M0 0H5.66578V13H0V0Z" fill="#000091" />
          <path d="M11.3341 0H17V13H11.3341V0Z" fill="#E1000F" />
        </svg>
      );
  }
};

const LanguageSwitcher = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { t, i18n } = useTranslation();
  const lang = getLang(params);

  if (!params.lang || supportedLngs.length < 2) return null;

  // Create collection for Ark UI Select
  const languageCollection = createListCollection({
    items: supportedLngs.map((lng) => ({ value: lng, label: lng })),
  });

  return (
    <Select.Root
      collection={languageCollection}
      defaultValue={[lang]}
      onValueChange={(details: any) => {
        const value = details.value[0];
        const convertPathname = (lng: string) => {
          return pathname.replace(`/${lang}`, `/${lng}`);
        };
        i18n.changeLanguage(value);
        navigate(convertPathname(value));
      }}
    >
      <Select.Trigger
        aria-label="Lang"
        className={css({
          maxWidth: 'none',
          width: 'auto',
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          color: 'current',
        })}
      >
        <Select.Value />
      </Select.Trigger>

      <Select.Content>
        {languageCollection.items.map((item) => (
          <Select.Item key={item.value} item={item}>
            <span className={flex({ gap: '2', alignItems: 'center' })}>
              <Flag lang={item.value} />
              {t(`common:language.${item.value}`)}
            </span>
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

export { LanguageSwitcher };
