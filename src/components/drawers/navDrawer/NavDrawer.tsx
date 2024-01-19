'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsNavDrawerOpen } from '@/lib/redux/navDrawer/navDrawerSlice';
import { Box, useTheme, useMediaQuery, IconButton } from '@mui/material';
import NavDraweOptions from './NavDrawerOptions';
import useColorPalette from '@/hooks/useColorPalette';
import DrawerComponent from '@/components/drawers/DrawerComponent';
import { Menu } from '@mui/icons-material';
import { useEffect } from 'react';
import DrawerHeader from '../DrawerHeader';

export default function NavDrawer() {
  const dispatch = useAppDispatch();
  const colorPalette = useColorPalette();
  const isNavDrawerOpen = useAppSelector((state) => state.navDrawer.isNavDrawerOpen);
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.up('md'));
  const navbarHeight = document.getElementById('navbar')?.offsetHeight;

  useEffect(() => {
    isBelowMedium ? dispatch(setIsNavDrawerOpen(false)) : null;
  }, [isBelowMedium, dispatch]);

  function handleOpenNavDrawer() {
    dispatch(setIsNavDrawerOpen(true));
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
        isOpen={isNavDrawerOpen}
        zIndex={(theme) => theme.zIndex.appBar + 1}>
        <DrawerHeader
          label="Menu"
          onClick={handleCloseNavDrawer}
          height={navbarHeight}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: 1 }}>
          <NavDraweOptions />
        </Box>
      </DrawerComponent>
    </>
  );
}
