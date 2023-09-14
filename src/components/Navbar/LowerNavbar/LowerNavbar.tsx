'use client';

import { AppBar, Container, Toolbar } from '@mui/material';
import LowerNavbarOptions from './LowerNavbarOptions';
import NavbarTitleAndLogo from '../NavbarTitleAndLogo';

export default function LowerNavbar() {
  return (
    <AppBar
      component="div"
      elevation={0}
      position="sticky"
      sx={{ backgroundColor: 'lowerNavbar.background', zIndex: 1 }}>
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{ height: 64 }}>
          <NavbarTitleAndLogo
            variant="h6"
            display="flex"
            color="lowerNavbar.text"
          />
          <LowerNavbarOptions />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
