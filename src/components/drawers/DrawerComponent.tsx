'use client';

import { Fragment, KeyboardEvent, ReactNode, useCallback, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import { DrawerAnchor, DrawerState } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsNavDrawerOpen } from '@/lib/redux/navDrawer/navDrawerSlice';
import { setCartItemToEditId, setIsCartOpen } from '@/lib/redux/cart/cartSlice';
import { setIsEditImageDrawerOpen } from '@/lib/redux/productForm/productFormSlice';
import { usePathname } from 'next/navigation';

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
  const isEditImageDrawerOpen = useAppSelector((state) => state.productForm.isEditImageDrawerOpen);
  const { isCartOpen, cartItemToEditId } = useAppSelector((state) => state.cart);

  const handleCloseDrawer = useCallback(
    (event: KeyboardEvent | MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as KeyboardEvent).key === 'Tab' || (event as KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      if (isNavDrawerOpen.left) {
        dispatch(setIsNavDrawerOpen(false));
      }

      if (isCartOpen.right) {
        dispatch(setIsCartOpen(false));
      }

      if (isEditImageDrawerOpen.right) {
        dispatch(setIsEditImageDrawerOpen(false));
      }

      if (cartItemToEditId) {
        dispatch(setCartItemToEditId(null));
      }
    },
    [isNavDrawerOpen, isCartOpen, isEditImageDrawerOpen, cartItemToEditId, dispatch]
  );

  useEffect(() => {
    // Function to handle click outside the drawer
    const handleClickOutside = (event: MouseEvent) => {
      const drawerElements = document.querySelectorAll('.MuiDrawer-root');
      const isClickInsideDrawer = Array.from(drawerElements).some((drawerElement) =>
        drawerElement.contains(event.target as Node)
      );

      if (!isClickInsideDrawer) {
        handleCloseDrawer(event);
      }
    };

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
                backgroundColor: 'background.default',
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
