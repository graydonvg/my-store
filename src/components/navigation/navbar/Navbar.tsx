'use client';

import { AppBar, Box } from '@mui/material';
import LowerNavbar from '../../navigation/navbar/lowerNavbar/LowerNavbar';
import UpperNavbar from '../../navigation/navbar/upperNavbar/UpperNavbar';
import { ElevationScroll } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import CartNavbar from '../cartNavbar';

export default function Navbar() {
  const pathname = usePathname();
  const isCartView = pathname.includes('/cart');
  return (
    <>
      <ElevationScroll>
        <AppBar
          id="navbar"
          color="transparent"
          elevation={0}
          position="sticky">
          {!isCartView ? (
            <>
              <UpperNavbar />
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <LowerNavbar />
              </Box>
            </>
          ) : (
            <CartNavbar />
          )}
        </AppBar>
      </ElevationScroll>
    </>
  );
}
