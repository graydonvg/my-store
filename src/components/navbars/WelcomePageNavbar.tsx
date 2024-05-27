'use client';

import { AppBar, Box, useTheme } from '@mui/material';
import CommonNavbarContainer from '../ui/containers/CommonNavbarContainer';
import NavbarTitle from './NavbarTitle';
import { ElevationScroll } from '../ui/ElevationScroll';

export default function WelcomePageNavbar() {
  const theme = useTheme();

  return (
    <ElevationScroll>
      <AppBar
        component="nav"
        color="transparent"
        elevation={0}
        position="sticky">
        <Box sx={{ backgroundColor: theme.palette.custom.navbar.upper.background }}>
          <CommonNavbarContainer>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: '64px',
              }}>
              <NavbarTitle
                component="h2"
                variant="h5"
                color={(theme) => theme.palette.custom.navbar.upper.text}
              />
            </Box>
          </CommonNavbarContainer>
        </Box>
      </AppBar>
    </ElevationScroll>
  );
}
