import { motion, useScroll, useSpring } from 'framer-motion';

import { css, cx } from '@ocobo/styled-system/css';

interface ScrollProgressBarProps
  extends React.ComponentProps<typeof motion.div> {
  variant?: 'coral' | 'mint' | 'sky' | 'dark';
}

const ScrollProgressBar: React.FunctionComponent<ScrollProgressBarProps> = ({
  className,
  variant = 'dark',
  ...props
}) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress);
  return (
    <motion.div
      style={{ scaleX }}
      className={cx(
        css({
          h: '[5px]',
          w: 'full',
          position: 'sticky',
          top: {
            base: 'var(--main-header-height-mobile)',
            lg: 'var(--main-header-height)',
          },
          left: '0',
          bg: variant,
          transformOrigin: '0 50%',
          zIndex: '1',
        }),
        className,
      )}
      {...props}
    />
  );
};

ScrollProgressBar.displayName = 'ScrollProgressBar';

export { ScrollProgressBar };
