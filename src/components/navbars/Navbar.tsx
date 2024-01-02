'use client';

import { AppBar, Box } from '@mui/material';
import LowerNavbar from './lowerNavbar/LowerNavbar';
import UpperNavbar from './upperNavbar/UpperNavbar';
import { usePathname } from 'next/navigation';
import CheckoutNavbar from './CheckoutNavbar';
import { ElevationScroll } from '../ui/ElevationScroll';

type MainNavBarProps = {
  show: boolean;
};

function MainNavBar({ show }: MainNavBarProps) {
  if (!show) return null;

  return (
    <>
      <UpperNavbar />
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <LowerNavbar />
      </Box>
    </>
  );
}

type CheckoutFlowNavBarProps = {
  show: boolean;
};

function CheckoutFlowNavBar({ show }: CheckoutFlowNavBarProps) {
  if (!show) return null;

  return <CheckoutNavbar />;
}

export default function Navbar() {
  const pathname = usePathname();
  const isCheckoutFlow = pathname.includes('/cart') || pathname.includes('/checkout');

  return (
    <>
      <ElevationScroll>
        <AppBar
          id="navbar"
          color="transparent"
          elevation={0}
          position="sticky">
          <MainNavBar show={!isCheckoutFlow} />
          <CheckoutFlowNavBar show={isCheckoutFlow} />
        </AppBar>
      </ElevationScroll>
    </>
  );
}
