/**
 * Select Component - Ark UI Implementation
 *
 * BREAKING CHANGE: This component now uses Ark UI instead of Radix UI.
 * The API requires using createListCollection from '@ark-ui/react/select'.
 *
 * @example
 * ```tsx
 * import { createListCollection } from '@ark-ui/react/select';
 *
 * const fruitCollection = createListCollection({
 *   items: [
 *     { value: 'apple', label: 'Apple' },
 *     { value: 'banana', label: 'Banana' },
 *   ],
 * });
 *
 * <Select.Root collection={fruitCollection} defaultValue={['apple']}>
 *   <Select.Trigger>
 *     <Select.Value placeholder="Select a fruit" />
 *   </Select.Trigger>
 *   <Select.Content>
 *     {fruitCollection.items.map((item) => (
 *       <Select.Item key={item.value} item={item}>
 *         {item.label}
 *       </Select.Item>
 *     ))}
 *   </Select.Content>
 * </Select.Root>
 * ```
 *
 * Key differences from Radix UI:
 * - Must use `collection` prop with createListCollection
 * - `defaultValue` is now an array: `['value']` not `'value'`
 * - `onValueChange` receives details object: `(details) => details.value[0]`
 * - Items require `item` prop from collection
 */
import * as React from 'react';

import { Portal } from '@ark-ui/react/portal';
import { Select as ArkSelect } from '@ark-ui/react/select';
import { Check, ChevronDown } from 'lucide-react';

import { styled } from '@ocobo/styled-system/jsx';
import { icon, select } from '@ocobo/styled-system/recipes';

// Ark UI uses styled() directly, no @shadow-panda/style-context needed
const StyledRoot = styled(ArkSelect.Root);
const StyledControl = styled(ArkSelect.Control);
const StyledTrigger = styled(ArkSelect.Trigger);
const StyledValueText = styled(ArkSelect.ValueText);
const StyledIndicator = styled(ArkSelect.Indicator);
const StyledPositioner = styled(ArkSelect.Positioner);
const StyledContent = styled(ArkSelect.Content);
const StyledItemGroup = styled(ArkSelect.ItemGroup);
const StyledItemGroupLabel = styled(ArkSelect.ItemGroupLabel);
const StyledItem = styled(ArkSelect.Item);
const StyledItemText = styled(ArkSelect.ItemText);
const StyledItemIndicator = styled(ArkSelect.ItemIndicator);

const TriggerBase = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof ArkSelect.Trigger>
>(({ children, ...props }, ref) => {
  const styles = select();
  return (
    <StyledControl>
      <StyledTrigger ref={ref} className={styles.trigger} {...props}>
        <StyledValueText className={styles.value}>{children}</StyledValueText>
        <StyledIndicator>
          <ChevronDown className={icon({ dimmed: true })} />
        </StyledIndicator>
      </StyledTrigger>
    </StyledControl>
  );
});
TriggerBase.displayName = 'SelectTrigger';

const ContentBase = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ArkSelect.Content> & {
    position?: 'popper' | 'item-aligned';
  }
>(({ children, position = 'popper', ...props }, ref) => {
  const styles = select();
  return (
    <Portal>
      <StyledPositioner>
        <StyledContent
          ref={ref}
          className={styles.content}
          data-position={position}
          {...props}
        >
          <div className={styles.viewport} data-position={position}>
            {children}
          </div>
        </StyledContent>
      </StyledPositioner>
    </Portal>
  );
});
ContentBase.displayName = 'SelectContent';

// Generic wrapper for Select.Item with proper typing
interface SelectItemProps {
  children?: React.ReactNode;
  item: any; // Ark UI collection item
  [key: string]: any; // Allow other props from Ark UI
}

const ItemBase = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, item, ...props }, ref) => {
    const styles = select();
    return (
      <StyledItem ref={ref} item={item} className={styles.item} {...props}>
        <StyledItemIndicator className={styles.itemIndicator}>
          <Check className={icon()} />
        </StyledItemIndicator>
        <StyledItemText>{children}</StyledItemText>
      </StyledItem>
    );
  },
);
ItemBase.displayName = 'SelectItem';

const GroupBase = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ArkSelect.ItemGroup>
>((props, ref) => {
  const styles = select();
  return <StyledItemGroup ref={ref} className={styles.group} {...props} />;
});
GroupBase.displayName = 'SelectGroup';

const LabelBase = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ArkSelect.ItemGroupLabel>
>((props, ref) => {
  const styles = select();
  return <StyledItemGroupLabel ref={ref} className={styles.label} {...props} />;
});
LabelBase.displayName = 'SelectLabel';

const SeparatorBase = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const styles = select();
  return <div ref={ref} className={styles.separator} {...props} />;
});
SeparatorBase.displayName = 'SelectSeparator';

// Generic wrapper for Select.Root with proper typing
interface SelectRootProps {
  collection: any; // Ark UI ListCollection
  children?: React.ReactNode;
  [key: string]: any; // Allow other props from Ark UI (defaultValue, onValueChange, etc.)
}

const RootBase = React.forwardRef<HTMLDivElement, SelectRootProps>(
  ({ collection, ...props }, ref) => {
    const styles = select();
    return (
      <StyledRoot
        ref={ref}
        collection={collection}
        className={styles.root}
        {...props}
      />
    );
  },
);
RootBase.displayName = 'SelectRoot';

export const Select = {
  Root: RootBase,
  Group: GroupBase,
  Value: StyledValueText, // Note: ValueText is used inside Trigger
  Trigger: TriggerBase,
  Content: ContentBase,
  Label: LabelBase,
  Item: ItemBase,
  Separator: SeparatorBase,
};
