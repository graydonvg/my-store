'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsNavDrawerOpen } from '@/lib/redux/navDrawer/navDrawerSlice';
import { Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NavDraweOptions from './NavDrawerOptions';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import DrawerComponent from '@/components/ui/DrawerComponent';
import { Menu } from '@mui/icons-material';
import { useEffect } from 'react';

export default function NavDrawer() {
  const dispatch = useAppDispatch();
  const customColorPalette = useCustomColorPalette();
  const navbarHeight = document.getElementById('navbar')?.offsetHeight;
  const isNavDrawerOpen = useAppSelector((state) => state.navDrawer.isNavDrawerOpen);
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    isBelowMedium ? dispatch(setIsNavDrawerOpen({ left: false })) : null;
  }, [isBelowMedium, dispatch]);

  function handleOpenNavDrawer() {
    dispatch(setIsNavDrawerOpen({ left: true }));
  }

  function handleCloseNavDrawer() {
    dispatch(setIsNavDrawerOpen({ left: false }));
  }

  return (
    <>
      <Menu
        sx={{
          color: customColorPalette.grey.light,
          cursor: 'pointer',
        }}
        aria-label="open navigation drawer"
        onClick={handleOpenNavDrawer}
      />
      <DrawerComponent
        width="100vw"
        isOpen={isNavDrawerOpen}
        zIndex={(theme) => theme.zIndex.appBar + 1}>
        <Box
          sx={{
            backgroundColor: customColorPalette.grey.dark,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
            height: navbarHeight,
            paddingX: 2,
          }}>
          <Typography
            color={customColorPalette.grey.light}
            variant="h5"
            component="span">
            Menu
          </Typography>
          <CloseIcon
            sx={{
              cursor: 'pointer',
              padding: 0,
              color: customColorPalette.grey.light,
              '&:hover': { backgroundColor: customColorPalette.grey.dark },
            }}
            aria-label="close navigation drawer"
            onClick={handleCloseNavDrawer}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: 1 }}>
          <NavDraweOptions />
        </Box>
      </DrawerComponent>
    </>
  );
}
