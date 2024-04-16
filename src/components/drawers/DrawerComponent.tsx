import { Fragment, KeyboardEvent, ReactNode, useCallback, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';

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
  elevation?: number;
  width: string | Record<string, string>;
  zIndex: number;
  children: ReactNode;
  isOpen: DrawerState;
  closeDrawer: () => void;
};

export default function DrawerComponent({
  elevation = 0,
  isOpen = initialState,
  zIndex,
  width,
  children,
  closeDrawer,
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
            sx={{ zIndex }}
            PaperProps={{
              elevation: elevation,
              sx: {
                width: width,
                backgroundColor: (theme) => theme.palette.background.default,
              },
            }}
            anchor={anchor}
            open={isOpen ? isOpen[anchor] : false}
            onClose={handleCloseDrawer}>
            {children}
          </Drawer>
        </Fragment>
      ))}
    </>
  );
}
