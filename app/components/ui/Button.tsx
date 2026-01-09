import * as React from 'react';

import { ark } from '@ark-ui/react/factory';

import { HTMLStyledProps, styled } from '@ocobo/styled-system/jsx';
import { button } from '@ocobo/styled-system/recipes';

// BaseButton: unstyled Ark UI button for composition (used by IconButton)
const BaseButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof ark.button>
>((props, ref) => {
  return <ark.button ref={ref} {...props} />;
});
BaseButton.displayName = 'BaseButton';

// Button: styled with button recipe
const Button = styled(ark.button, button);
type ButtonProps = HTMLStyledProps<typeof Button>;

export { Button, BaseButton };
export type { ButtonProps };
