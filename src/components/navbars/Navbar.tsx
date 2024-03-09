'use client';

import { AppBar, Box } from '@mui/material';
import LowerNavbar from './lowerNavbar/LowerNavbar';
import UpperNavbar from './upperNavbar/UpperNavbar';
import { usePathname } from 'next/navigation';
import { ElevationScroll } from '../ui/ElevationScroll';
import CheckoutNavbar from './CheckoutNavbar';
import AdminNavbar from './AdminNavbar';

export default function Navbar() {
  const pathname = usePathname();
  const isCheckoutFlow = pathname.includes('/cart') || pathname.includes('/checkout');
  const isAdminView = pathname.includes('admin');

  return (
    <>
      {!isAdminView ? (
        <ElevationScroll>
          <AppBar
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
            ) : null}
            {isCheckoutFlow ? <CheckoutNavbar /> : null}
          </AppBar>
        </ElevationScroll>
      ) : null}
    </>
  );
}
