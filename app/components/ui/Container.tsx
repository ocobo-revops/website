import { css, cx } from '@ocobo/styled-system/css';

const baseStyles = {
  mx: 'auto',
  px: { base: '4', sm: '6', lg: '8' },
} as const;

const containerStyles = {
  default: css({ ...baseStyles, maxW: '7xl' }),
  narrow: css({ ...baseStyles, maxW: '56rem' }),
  defaultMobileFull: css({ ...baseStyles, maxW: { base: 'full', md: '7xl' } }),
  narrowMobileFull: css({
    ...baseStyles,
    maxW: { base: 'full', md: '56rem' },
  }),
};

const Container: React.FunctionComponent<
  React.PropsWithChildren<
    React.HTMLAttributes<HTMLDivElement> & {
      isMobileFullWidth?: boolean;
      narrow?: boolean;
    }
  >
> = ({ children, className, isMobileFullWidth, narrow, ...props }) => {
  const variant = isMobileFullWidth
    ? narrow
      ? containerStyles.narrowMobileFull
      : containerStyles.defaultMobileFull
    : narrow
      ? containerStyles.narrow
      : containerStyles.default;

  return (
    <div className={cx(variant, className)} {...props}>
      {children}
    </div>
  );
};

Container.displayName = 'Container';

export { Container };
