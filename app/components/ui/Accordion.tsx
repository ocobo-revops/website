import * as React from 'react';

import { Accordion as ArkAccordion } from '@ark-ui/react/accordion';
import { ChevronRight } from 'lucide-react';

import { cx } from '@ocobo/styled-system/css';
import { accordion } from '@ocobo/styled-system/recipes';

const TriggerBase = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof ArkAccordion.ItemTrigger>
>(({ children, className, ...props }, ref) => {
  const styles = accordion();
  return (
    <div className={styles.header}>
      <ArkAccordion.ItemTrigger
        ref={ref}
        className={cx(styles.trigger, className)}
        {...props}
      >
        {children}
        <ChevronRight />
      </ArkAccordion.ItemTrigger>
    </div>
  );
});
TriggerBase.displayName = 'AccordionTrigger';

// Wrapper for content with inner div for animation
const ContentBase = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ArkAccordion.ItemContent>
>(({ children, ...props }, ref) => {
  const styles = accordion();
  return (
    <ArkAccordion.ItemContent ref={ref} className={styles.content} {...props}>
      <div>{children}</div>
    </ArkAccordion.ItemContent>
  );
});
ContentBase.displayName = 'AccordionContent';

const RootBase = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ArkAccordion.Root>
>((props, ref) => {
  const styles = accordion();
  return <ArkAccordion.Root ref={ref} className={styles.root} {...props} />;
});
RootBase.displayName = 'AccordionRoot';

const ItemBase = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ArkAccordion.Item>
>(({ className, ...props }, ref) => {
  const styles = accordion();
  return (
    <ArkAccordion.Item
      ref={ref}
      className={cx(styles.item, className)}
      {...props}
    />
  );
});
ItemBase.displayName = 'AccordionItem';

export const Accordion = {
  Root: RootBase,
  Item: ItemBase,
  Trigger: TriggerBase,
  Content: ContentBase,
};
