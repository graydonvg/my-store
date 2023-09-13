'use client';

import { Box, Toolbar } from '@mui/material';
import LowerNavbarOptions from './LowerNavbarOptions';
import NavbarTitleAndLogo from '../ui/NavbarTitleAndLogo';
import NavbarContainer from './NavbarContainer';

export default function LowerNavbar() {
  return (
    <NavbarContainer backgroundColor="lowerNavbar.background">
      <Toolbar
        disableGutters
        sx={{ height: 64 }}>
        <NavbarTitleAndLogo
          variant="h6"
          display="flex"
          color="lowerNavbar.text"
        />
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LowerNavbarOptions />
        </Box>
      </Toolbar>
    </NavbarContainer>
  );
}
