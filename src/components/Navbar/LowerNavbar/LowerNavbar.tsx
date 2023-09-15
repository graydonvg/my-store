'use client';

import { AppBar, Container, Toolbar, useTheme } from '@mui/material';
import LowerNavbarOptions from './LowerNavbarOptions';
import NavbarTitleAndLogo from '../NavbarTitleAndLogo';

export default function LowerNavbar() {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const backgroundColor = mode === 'light' ? 'custom.grey.light' : 'custom.grey.medium';
  const logoColor = mode === 'light' ? 'custom.grey.medium' : 'custom.grey.light';

  return (
    <AppBar
      component="div"
      elevation={0}
      position="sticky"
      sx={{ backgroundColor, zIndex: 1 }}>
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{ height: 56 }}>
          <NavbarTitleAndLogo
            variant="h6"
            display="flex"
            color={logoColor}
          />
          <LowerNavbarOptions />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
