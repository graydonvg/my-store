'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsNavDrawerOpen } from '@/lib/redux/features/navDrawer/navDrawerSlice';
import { Box, useTheme, useMediaQuery, IconButton } from '@mui/material';
import NavDrawerOptions from './navDrawerOptions/NavDrawerOptions';
import DrawerComponent from '@/components/drawers/DrawerComponent';
import { Menu } from '@mui/icons-material';
import { useEffect } from 'react';
import DrawerHeader from '../DrawerHeader';
import { setIsCartOpen } from '@/lib/redux/features/cart/cartSlice';

export default function NavDrawer() {
  const dispatch = useAppDispatch();
  const isNavDrawerOpen = useAppSelector((state) => state.navDrawer.isNavDrawerOpen);
  const { isCartOpen } = useAppSelector((state) => state.cart);
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    isBelowMedium ? dispatch(setIsNavDrawerOpen(false)) : null;
  }, [isBelowMedium, dispatch]);

  function openNavDrawer() {
    dispatch(setIsNavDrawerOpen(true));
    if (isCartOpen) {
      dispatch(setIsCartOpen(false));
    }
  }

  function closeNavDrawer() {
    dispatch(setIsNavDrawerOpen(false));
  }

  return (
    <>
      <IconButton
        edge="start"
        sx={{
          color: theme.palette.custom.navbar.upper.text,
        }}
        aria-label="open drawer"
        onClick={openNavDrawer}>
        <Menu />
      </IconButton>

      <DrawerComponent
        isOpen={{ left: isNavDrawerOpen }}
        closeDrawer={closeNavDrawer}
        drawerProps={{ sx: { zIndex: theme.zIndex.appBar + 1 } }}
        paperProps={{
          elevation: 0,
          sx: { width: '100vw' },
        }}>
        <DrawerHeader
          label="Menu"
          onClick={closeNavDrawer}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: 1 }}>
          <NavDrawerOptions />
        </Box>
      </DrawerComponent>
    </>
  );
}
