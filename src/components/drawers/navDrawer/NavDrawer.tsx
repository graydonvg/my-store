'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsNavDrawerOpen } from '@/lib/redux/slices/navDrawerSlice';
import { Box, useTheme, useMediaQuery, IconButton } from '@mui/material';
import NavDrawerOptions from './navDrawerOptions/NavDrawerOptions';
import useColorPalette from '@/hooks/useColorPalette';
import DrawerComponent from '@/components/drawers/DrawerComponent';
import { Menu } from '@mui/icons-material';
import { useEffect } from 'react';
import DrawerHeader from '../DrawerHeader';
import { setIsCartOpen } from '@/lib/redux/slices/cartSlice';

export default function NavDrawer() {
  const dispatch = useAppDispatch();
  const colorPalette = useColorPalette();
  const isNavDrawerOpen = useAppSelector((state) => state.navDrawer.isNavDrawerOpen);
  const { isCartOpen } = useAppSelector((state) => state.cart);
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.up('md'));
  const navbarHeight = document.getElementById('navbar')?.offsetHeight;

  useEffect(() => {
    isBelowMedium ? dispatch(setIsNavDrawerOpen(false)) : null;
  }, [isBelowMedium, dispatch]);

  function handleOpenNavDrawer() {
    dispatch(setIsNavDrawerOpen(true));
    if (isCartOpen) {
      dispatch(setIsCartOpen(false));
    }
  }

  function handleCloseNavDrawer() {
    dispatch(setIsNavDrawerOpen(false));
  }

  return (
    <>
      <IconButton
        size="small"
        sx={{
          padding: 0,
          color: colorPalette.navBar.upper.text,
          cursor: 'pointer',
          '@media (hover: hover)': {
            '&:hover': {
              backgroundColor: 'transparent',
            },
          },
        }}
        aria-label="open navigation drawer"
        onClick={handleOpenNavDrawer}>
        <Menu />
      </IconButton>
      <DrawerComponent
        width="100vw"
        isOpen={{ left: isNavDrawerOpen }}
        zIndex={theme.zIndex.appBar + 1}
        closeDrawer={handleCloseNavDrawer}>
        <DrawerHeader
          label="Menu"
          onClick={handleCloseNavDrawer}
          height={navbarHeight}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: 1 }}>
          <NavDrawerOptions />
        </Box>
      </DrawerComponent>
    </>
  );
}
