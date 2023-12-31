'use client';

import { AppBar, Box } from '@mui/material';
import LowerNavbar from './lowerNavbar/LowerNavbar';
import UpperNavbar from './upperNavbar/UpperNavbar';
import { usePathname } from 'next/navigation';
import CheckoutNavbar from './CheckoutNavbar';
import { ElevationScroll } from '../ui/ElevationScroll';

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
          {!isCheckoutFlow ? (
            <>
              <UpperNavbar />
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <LowerNavbar />
              </Box>
            </>
          ) : (
            <CheckoutNavbar />
          )}
        </AppBar>
      </ElevationScroll>
    </>
  );
}
