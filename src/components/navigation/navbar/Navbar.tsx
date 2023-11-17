'use client';

import { AppBar, Box } from '@mui/material';
import LowerNavbar from '../../navigation/navbar/lowerNavbar/LowerNavbar';
import UpperNavbar from '../../navigation/navbar/upperNavbar/UpperNavbar';
import { ElevationScroll } from '@/lib/utils';

export default function Navbar() {
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
    </>
  );
}
