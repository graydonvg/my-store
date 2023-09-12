'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useEffect } from 'react';
import LowerNavbar from './LowerNavbar';
import UpperNavbar from './UpperNavbar';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    isBelowMedium ? dispatch(setIsDrawerOpen({ left: false })) : null;
  }, [isBelowMedium, dispatch]);

  return (
    <>
      <UpperNavbar />
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <LowerNavbar />
      </Box>
    </>
  );
}
