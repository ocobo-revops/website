import * as React from 'react';

import { ScrollArea as ArkScrollArea } from '@ark-ui/react/scroll-area';

import { styled } from '@ocobo/styled-system/jsx';
import { scrollArea } from '@ocobo/styled-system/recipes';

// Ark UI uses styled() directly, no @shadow-panda/style-context needed
const StyledRoot = styled(ArkScrollArea.Root);
const StyledViewport = styled(ArkScrollArea.Viewport);
const StyledScrollbar = styled(ArkScrollArea.Scrollbar);
const StyledThumb = styled(ArkScrollArea.Thumb);
const StyledCorner = styled(ArkScrollArea.Corner);

const BaseScrollBar = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ArkScrollArea.Scrollbar>
>(({ orientation = 'vertical', ...props }, ref) => (
  <StyledScrollbar ref={ref} orientation={orientation} {...props}>
    <StyledThumb />
  </StyledScrollbar>
));
BaseScrollBar.displayName = 'ScrollBar';

export const ScrollBar = BaseScrollBar;

const BaseScrollArea = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ArkScrollArea.Root>
>(({ children, ...props }, ref) => {
  const styles = scrollArea();
  return (
    <StyledRoot ref={ref} className={styles.root} {...props}>
      <StyledViewport className={styles.viewport}>{children}</StyledViewport>
      <ScrollBar className={styles.scrollbar} />
      <StyledCorner className={styles.corner} />
    </StyledRoot>
  );
});
BaseScrollArea.displayName = 'ScrollArea';

export const ScrollArea = BaseScrollArea;
