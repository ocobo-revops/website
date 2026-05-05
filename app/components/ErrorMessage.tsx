import { BombIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { Container } from '@ocobo/styled-system/jsx';

import { ButtonLink } from '~/components/ui/button-link';
import { url } from '~/utils/url';

const Message: React.FunctionComponent<
  React.PropsWithChildren<unknown>
> = () => {
  const { t } = useTranslation();

  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 452px)',
      })}
    >
      <BombIcon className={css({ h: '8', w: '8' })} />
      <h1
        className={css({
          textStyle: 'heading2',
          mt: 4,
        })}
      >
        {t('error.title')}
      </h1>
      <p>{t('error.description')}</p>
      <p>
        <ButtonLink to={url.homepage} variant="solid">
          {t('error.back')}
        </ButtonLink>
      </p>
    </div>
  );
};

const ErrorMessage = () => {
  return (
    <Container>
      <Message />
    </Container>
  );
};

export { ErrorMessage };
