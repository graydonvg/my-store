'use client';

import { AppBar, Box } from '@mui/material';
import LowerNavbar from '../../navigation/navbar/lowerNavbar/LowerNavbar';
import UpperNavbar from '../../navigation/navbar/upperNavbar/UpperNavbar';
import { ElevationScroll } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import CheckoutNavbar from '../CheckoutNavbar';

export default function Navbar() {
  const pathname = usePathname();
  const showCheckoutNav = pathname.includes('/cart') || pathname.includes('/checkout');
  return (
    <>
      <ElevationScroll>
        <AppBar
          id="navbar"
          color="transparent"
          elevation={0}
          position="sticky">
          {!showCheckoutNav ? (
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
