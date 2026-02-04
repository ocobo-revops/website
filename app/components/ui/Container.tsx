import { css, cx } from '@ocobo/styled-system/css';

const Container: React.FunctionComponent<
  React.PropsWithChildren<
    React.HTMLAttributes<HTMLDivElement> & {
      isMobileFullWidth?: boolean;
      narrow?: boolean;
    }
  >
> = ({ children, className, isMobileFullWidth, narrow, ...props }) => {
  const maxW = narrow ? '5xl' : '7xl';
  const maxWValue = isMobileFullWidth ? { base: 'full', md: maxW } : maxW;

  return (
    <div
      className={cx(
        css({
          maxW: maxWValue,
          mx: 'auto',
          px: { base: '4', sm: '6', lg: '8' },
        }),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Container.displayName = 'Container';

export { Container };
