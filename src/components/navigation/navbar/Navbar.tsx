'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsNavDrawerOpen } from '@/lib/redux/navDrawer/navDrawerSlice';
import { AppBar, Box, useTheme, useMediaQuery } from '@mui/material';
import { useEffect } from 'react';
import LowerNavbar from '../../navigation/navbar/lowerNavbar/LowerNavbar';
import UpperNavbar from '../../navigation/navbar/upperNavbar/UpperNavbar';
import { ElevationScroll } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import ModalComponent from '@/components/ui/ModalComponent';
import UpdateUserData from '@/components/forms/UpdateUserData';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.up('md'));
  const isCartOpen = useAppSelector((state) => state.cart.isCartOpen);
  const searchParams = useSearchParams();
  const modal = searchParams.get('modal');
  !!modal ? document.body.classList.add('modal-open') : document.body.classList.remove('modal-open');
  isCartOpen.right ? document.body.classList.add('drawer-open') : document.body.classList.remove('drawer-open');

  useEffect(() => {
    isBelowMedium ? dispatch(setIsNavDrawerOpen({ left: false })) : null;
  }, [isBelowMedium, dispatch]);

  return (
    <>
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
      <ModalComponent isOpen={modal === 'update'}>
        <UpdateUserData />
      </ModalComponent>
    </>
  );
}
