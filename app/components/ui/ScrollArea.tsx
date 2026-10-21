import * as React from 'react';

import { ScrollArea as ArkScrollArea } from '@ark-ui/react/scroll-area';

import { styled } from '@ocobo/styled-system/jsx';
import { scrollArea } from '@ocobo/styled-system/recipes';

// Ark UI uses styled() directly, no @shadow-panda/style-context needed
const StyledViewport = styled(ArkScrollArea.Viewport);
const StyledThumb = styled(ArkScrollArea.Thumb);
const StyledCorner = styled(ArkScrollArea.Corner);

const BaseScrollBar = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ArkScrollArea.Scrollbar>
>(({ orientation = 'vertical', ...props }, ref) => (
  <ArkScrollArea.Scrollbar ref={ref} orientation={orientation} {...props}>
    <StyledThumb />
  </ArkScrollArea.Scrollbar>
));
BaseScrollBar.displayName = 'ScrollBar';

export const ScrollBar = BaseScrollBar;

const BaseScrollArea = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ArkScrollArea.Root>
>(({ children, ...props }, ref) => {
  const styles = scrollArea();
  return (
    <ArkScrollArea.Root ref={ref} className={styles.root} {...props}>
      <StyledViewport className={styles.viewport}>{children}</StyledViewport>
      <ScrollBar className={styles.scrollbar} />
      <StyledCorner className={styles.corner} />
    </ArkScrollArea.Root>
  );
});
BaseScrollArea.displayName = 'ScrollArea';

export const ScrollArea = BaseScrollArea;
