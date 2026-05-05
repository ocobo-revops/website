import * as React from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { css, cx } from '@ocobo/styled-system/css';
import { styled } from '@ocobo/styled-system/jsx';

const NavButton = styled('button', {
  base: {
    color: 'dark',
    cursor: 'pointer',
    p: '2',
    _hover: {
      color: 'dark',
    },
    _disabled: {
      color: 'gray.light',
      cursor: 'not-allowed',
    },
  },
});

const variants = {
  enter: (direction: number) => {
    return {
      y: direction > 0 ? 100 : -100,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      y: direction < 0 ? 100 : -100,
      opacity: 0,
    };
  },
};

type CarouselItemProps = React.HTMLAttributes<HTMLDivElement>;

const Item: React.FunctionComponent<
  React.ComponentProps<typeof motion.div>
> = ({ children, className, ...props }) => (
  <motion.div
    variants={variants}
    initial="enter"
    animate="center"
    exit="exit"
    className={cx(
      css({
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }),
      className,
    )}
    {...props}
  >
    {children}
  </motion.div>
);

interface CarouselRenderItemProps<T> {
  item: T;
}

interface CarouselProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  items: T[];
  renderItem: (
    props: CarouselRenderItemProps<T>,
  ) => React.ReactElement<CarouselItemProps>;
}

const Root = <T extends { id: string }>({
  items,
  renderItem,
  className,
  ...props
}: CarouselProps<T>) => {
  const [[page, direction], setPage] = React.useState([0, 0]);

  // Handle empty state
  if (items.length === 0) {
    return (
      <div
        className={cx(
          css({
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            color: 'gray.medium',
          }),
          className,
        )}
        {...props}
      >
        <p className={css({ textAlign: 'center' })}>Aucun contenu disponible</p>
      </div>
    );
  }

  const onClickPrev = () => {
    setPage(([page]) => [page === 0 ? items.length - 1 : page - 1, -1]);
  };
  const onClickNext = () => {
    setPage(([page]) => [page === items.length - 1 ? 0 : page + 1, 1]);
  };

  return (
    <div
      className={cx(
        css({
          position: 'relative',
        }),
        className,
      )}
      {...props}
    >
      <AnimatePresence initial={false} custom={direction}>
        {items.map((item, index) => {
          if (index !== page) {
            return null;
          }
          return (
            <React.Fragment key={item.id}>
              {renderItem({
                item,
              })}
            </React.Fragment>
          );
        })}
      </AnimatePresence>

      {/* Only show navigation if we have items */}
      {items.length > 1 && (
        <div
          className={css({
            width: 'full',
            display: 'flex',
            justifyContent: 'space-between',
            position: 'absolute',
            top: '50%',
            left: 0,
            translateY: '-50%',
            zIndex: 2,
            px: '4',
          })}
        >
          <NavButton onClick={onClickPrev}>
            <ChevronLeftIcon className={css({ h: '6', w: '6' })} />
          </NavButton>

          <NavButton onClick={onClickNext}>
            <ChevronRightIcon className={css({ h: '6', w: '6' })} />
          </NavButton>
        </div>
      )}
    </div>
  );
};
export const Carousel = { Root, Item };
