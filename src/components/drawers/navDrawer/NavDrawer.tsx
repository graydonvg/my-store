'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsNavDrawerOpen } from '@/lib/redux/features/navDrawer/navDrawerSlice';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import NavDrawerOptions from './navDrawerOptions/NavDrawerOptions';
import DrawerComponent from '@/components/ui/DrawerComponent';
import { useEffect } from 'react';
import DrawerHeader from '../DrawerHeader';
import { selectIsNavDrawerOpen } from '@/lib/redux/features/navDrawer/navDrawerSelectors';

export default function NavDrawer() {
  const dispatch = useAppDispatch();
  const isNavDrawerOpen = useAppSelector(selectIsNavDrawerOpen);
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    isBelowMedium ? dispatch(setIsNavDrawerOpen(false)) : null;
  }, [isBelowMedium, dispatch]);

  function closeNavDrawer() {
    dispatch(setIsNavDrawerOpen(false));
  }

  return (
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
  );
}
