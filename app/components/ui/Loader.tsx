import { css, cx } from '@ocobo/styled-system/css';

const Loader: React.FunctionComponent<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cx(
        css({
          display: 'grid',
          placeContent: 'center',
          minHeight: '[250px]',
        }),
        className,
      )}
      {...props}
    >
      <img src="/svg-loaders/three-dots.svg" alt="" width="40px" />
    </div>
  );
};

export { Loader };
