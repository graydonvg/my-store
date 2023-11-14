'use client';

import { Fragment, KeyboardEvent, ReactNode } from 'react';
import Drawer from '@mui/material/Drawer';
import { DrawerAnchor, DrawerState } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsNavDrawerOpen } from '@/lib/redux/navDrawer/navDrawerSlice';
import { setIsCartOpen } from '@/lib/redux/cart/cartSlice';

type Props = {
  isOpen: DrawerState;
  zIndex: (theme: any) => number;
  children: ReactNode;
};

export default function DrawerComponent({ isOpen, zIndex, children }: Props) {
  const dispatch = useAppDispatch();
  const isNavDrawerOpen = useAppSelector((state) => state.navDrawer.isNavDrawerOpen);
  const isCartOpen = useAppSelector((state) => state.cart.isCartOpen);

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
  };
  return (
    <>
      {(['left', 'right', 'top', 'bottom'] as const).map((anchor) => (
        <Fragment key={anchor}>
          <Drawer
            sx={{ zIndex }}
            PaperProps={{
              elevation: 0,
              sx: {
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
