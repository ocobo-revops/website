import { ArrowRight } from 'lucide-react';
import { NavLink, type NavLinkProps } from 'react-router';

import { cx } from '@ocobo/styled-system/css';
import { button } from '@ocobo/styled-system/recipes';
import type { ButtonVariantProps } from '@ocobo/styled-system/recipes/button';

interface ButtonLinkProps
  extends Omit<NavLinkProps, 'className'>,
    ButtonVariantProps {
  className?: string;
  children: React.ReactNode;
}

export const ButtonLink = ({
  variant,
  size,
  className,
  children,
  ...props
}: ButtonLinkProps) => {
  const arrowSize = size === 'sm' ? 14 : 18;

  return (
    <NavLink className={cx(button({ variant, size }), className)} {...props}>
      {children}
      <ArrowRight size={arrowSize} />
    </NavLink>
  );
};
