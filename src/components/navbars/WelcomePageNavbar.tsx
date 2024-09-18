'use client';

import { AppBar, Box, useTheme } from '@mui/material';
import CommonNavbarContainer from '../ui/containers/CommonNavbarContainer';
import NavbarTitle from './NavbarTitle';
import { ElevationScroll } from '../ui/ElevationScroll';
import ThemeToggleButton from '../theme/ThemeToggleButton';

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
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '64px',
              }}>
              <NavbarTitle
                component="h2"
                variant="h5"
                color={theme.palette.custom.navbar.upper.text}
              />
              <Box sx={{ paddingRight: '4px' }}>
                <ThemeToggleButton
                  edge="end"
                  size="medium"
                />
              </Box>
            </Box>
          </CommonNavbarContainer>
        </Box>
      </AppBar>
    </ElevationScroll>
  );
}
