'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsNavDrawerOpen } from '@/lib/redux/navDrawer/navDrawerSlice';
import { Typography, Box, useTheme, useMediaQuery, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NavDraweOptions from './NavDrawerOptions';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import DrawerComponent from '@/components/drawers/DrawerComponent';
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
      <IconButton
        size="small"
        sx={{
          padding: 0,
          color: customColorPalette.navBar.upper.text,
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
        <Box
          sx={{
            backgroundColor: customColorPalette.navBar.upper.background,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
            height: navbarHeight,
            paddingX: 2,
          }}>
          <Typography
            color={customColorPalette.navBar.upper.text}
            variant="h5"
            component="span">
            Menu
          </Typography>
          <IconButton
            size="small"
            sx={{
              cursor: 'pointer',
              padding: 0,
              color: customColorPalette.navBar.upper.text,
              '&:hover': { backgroundColor: customColorPalette.navBar.upper.background },
            }}
            aria-label="close navigation drawer"
            onClick={handleCloseNavDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: 1 }}>
          <NavDraweOptions />
        </Box>
      </DrawerComponent>
    </>
  );
}
