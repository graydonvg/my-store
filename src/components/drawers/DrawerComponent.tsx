import { Fragment, KeyboardEvent, ReactNode, useCallback, useEffect } from 'react';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import { PaperProps } from '@mui/material';

type DrawerState = {
  top?: boolean;
  left?: boolean;
  bottom?: boolean;
  right?: boolean;
};

const initialState: DrawerState = {
  top: false,
  bottom: false,
  left: false,
  right: false,
};

type Props = {
  children: ReactNode;
  isOpen: DrawerState;
  closeDrawer: () => void;
  drawerProps: DrawerProps;
  paperProps: PaperProps;
};

export default function DrawerComponent({
  isOpen = initialState,
  children,
  closeDrawer,
  drawerProps,
  paperProps,
}: Props) {
  const handleCloseDrawer = useCallback(
    (event: KeyboardEvent | MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as KeyboardEvent).key === 'Tab' || (event as KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      closeDrawer();
    },
    [closeDrawer]
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const drawerElements = document.querySelectorAll('.MuiDrawer-root');
      const isClickInsideDrawer = Array.from(drawerElements).some((drawerElement) =>
        drawerElement.contains(event.target as Node)
      );

      if (!isClickInsideDrawer) {
        handleCloseDrawer(event);
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleCloseDrawer]);

  return (
    <>
      {(['left', 'right', 'top', 'bottom'] as const).map((anchor) => (
        <Fragment key={anchor}>
          <Drawer
            variant="temporary"
            PaperProps={{
              ...paperProps,
            }}
            anchor={anchor}
            open={isOpen ? isOpen[anchor] : false}
            onClose={handleCloseDrawer}
            {...drawerProps}>
            {children}
          </Drawer>
        </Fragment>
      ))}
    </>
  );
}
