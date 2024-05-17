'use client';

import { AppBar, Box, useTheme } from '@mui/material';
import CommonNavbarContainer from '../ui/containers/CommonNavbarContainer';
import NavbarTitle from './NavbarTitle';

export default function NavbarWelcomePage() {
  const theme = useTheme();

  return (
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
  );
}
