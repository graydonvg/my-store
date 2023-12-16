'use client';

import { Fragment, KeyboardEvent, ReactNode } from 'react';
import Drawer from '@mui/material/Drawer';
import { DrawerAnchor, DrawerState } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsNavDrawerOpen } from '@/lib/redux/navDrawer/navDrawerSlice';
import { setCartItemToEditId, setIsCartOpen } from '@/lib/redux/cart/cartSlice';

type Props = {
  elevation?: number;
  width: string | Record<string, string>;
  isOpen: DrawerState;
  zIndex: (theme: any) => number;
  children: ReactNode;
};

export default function DrawerComponent({ elevation = 0, isOpen, zIndex, width, children }: Props) {
  const dispatch = useAppDispatch();
  const isNavDrawerOpen = useAppSelector((state) => state.navDrawer.isNavDrawerOpen);
  const { isCartOpen, cartItemToEditId } = useAppSelector((state) => state.cart);

  const handleCloseNavDrawer = (anchor: DrawerAnchor, open: boolean) => (event: KeyboardEvent | MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as KeyboardEvent).key === 'Tab' || (event as KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    if (isNavDrawerOpen.left) {
      dispatch(setIsNavDrawerOpen({ [anchor]: open }));
    }

    if (isCartOpen.right) {
      dispatch(setIsCartOpen({ [anchor]: open }));
    }

    if (cartItemToEditId) {
      dispatch(setCartItemToEditId(null));
    }
  };
  return (
    <>
      {(['left', 'right', 'top', 'bottom'] as const).map((anchor) => (
        <Fragment key={anchor}>
          <Drawer
            sx={{ zIndex }}
            PaperProps={{
              elevation: elevation,
              // elevation: 0,
              sx: {
                width: width,
                backgroundColor: 'background.default',
              },
            }}
            anchor={anchor}
            open={isOpen ? isOpen[anchor] : false}
            onClose={handleCloseNavDrawer(anchor, false)}>
            {children}
          </Drawer>
        </Fragment>
      ))}
    </>
  );
}
