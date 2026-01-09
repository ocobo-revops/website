import * as React from 'react';

import { ark } from '@ark-ui/react/factory';
import { createContext } from '@radix-ui/react-context';
import * as Portal from '@radix-ui/react-portal';
import { RemoveScroll } from 'react-remove-scroll';
import { useNavigation } from 'react-router';

import { css } from '@ocobo/styled-system/css';

const [MenuProvider, useMenuContext] = createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>('MobileMenu');

const MobileMenuProvider: React.FunctionComponent<React.PropsWithChildren> = ({
  children,
}) => {
  const [open, setOpen] = React.useState(false);

  const { state } = useNavigation();

  React.useEffect(() => {
    // Dismiss mobile keyboard if focusing an input (e.g. when searching)
    if (document.activeElement instanceof HTMLInputElement) {
      document.activeElement.blur();
    }

    setOpen(false);
  }, [state]);

  React.useEffect(() => {
    const mediaQueryList = window.matchMedia('(min-width: 1024px)');

    const handleChange = () => {
      setOpen((open) => (open ? !mediaQueryList.matches : false));
    };

    handleChange();
    mediaQueryList.addEventListener('change', handleChange);
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, []);

  return (
    <MenuProvider open={open} setOpen={setOpen}>
      {children}
    </MenuProvider>
  );
};

const useMobileMenuContext = () => useMenuContext('MobileMenu');

const MobileMenu: React.FunctionComponent<React.PropsWithChildren> = ({
  children,
}) => {
  const mobileMenu = useMobileMenuContext();

  if (!mobileMenu.open) {
    return null;
  }

  return (
    <Portal.Root>
      <RemoveScroll as={ark.div} allowPinchZoom enabled>
        <div
          className={css({
            position: 'fixed',
            inset: 0,
            zIndex: 1,
            display: 'grid',
            gridTemplateRows: 'auto minmax(0, 1fr)',
            backgroundColor: 'white',
          })}
        >
          {children}
        </div>
      </RemoveScroll>
    </Portal.Root>
  );
};

export { MobileMenu, useMobileMenuContext, MobileMenuProvider };
