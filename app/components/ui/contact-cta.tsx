import { useTranslation } from 'react-i18next';

import type { ButtonVariantProps } from '@ocobo/styled-system/recipes/button';

import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { url } from '~/utils/url';

import { ButtonLink } from './button-link';

type ContactCtaProps = ButtonVariantProps & {
  /** Label of the button; "Talk to an architect" when left out. */
  children?: React.ReactNode;
  className?: string;
  'data-testid'?: string;
};

/**
 * The "Talk to an architect" button. It always opens the contact page in the
 * current language, never an anchor further down the page.
 */
export function ContactCta({
  children,
  variant = 'primary',
  size,
  className,
  'data-testid': testId,
}: ContactCtaProps) {
  const { t } = useTranslation('common');
  const getLocalizedPath = useLocalizedPathname();

  return (
    <ButtonLink
      to={getLocalizedPath(url.contact)}
      variant={variant}
      size={size}
      className={className}
      data-testid={testId}
    >
      {children ?? t('navigation.cta')}
    </ButtonLink>
  );
}
