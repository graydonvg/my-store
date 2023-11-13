'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsNavDrawerOpen } from '@/lib/redux/navDrawer/navDrawerSlice';
import { AppBar, Box, useTheme, useMediaQuery } from '@mui/material';
import { useEffect } from 'react';
import LowerNavbar from '../../navigation/navbar/lowerNavbar/LowerNavbar';
import UpperNavbar from '../../navigation/navbar/upperNavbar/UpperNavbar';
import { ElevationScroll } from '@/lib/utils';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    isBelowMedium ? dispatch(setIsNavDrawerOpen({ left: false })) : null;
  }, [isBelowMedium, dispatch]);

  return (
    <ElevationScroll>
      <AppBar
        id="navbar"
        color="transparent"
        elevation={0}
        position="sticky">
        <UpperNavbar />
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <LowerNavbar />
        </Box>
      </AppBar>
    </ElevationScroll>
  );
}
