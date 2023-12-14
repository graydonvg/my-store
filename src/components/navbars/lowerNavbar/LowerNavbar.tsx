'use client';

import { Box, Container, useTheme } from '@mui/material';
import LowerNavbarOptions from './LowerNavbarOptions';
import NavbarTitleAndLogo from '../NavbarTitleAndLogo';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';

export default function LowerNavbar() {
  const theme = useTheme();
  const customColorPalette = useCustomColorPalette();
  const mode = theme.palette.mode;
  const backgroundColor = mode === 'light' ? customColorPalette.grey.light : customColorPalette.grey.medium;
  const logoColor = mode === 'light' ? customColorPalette.grey.medium : customColorPalette.grey.light;

  return (
    <Box
      id="lower-nav"
      component="div"
      position="sticky"
      sx={{ backgroundColor }}>
      <Container
        maxWidth="lg"
        disableGutters>
        <Box sx={{ display: 'flex', alignItems: 'center', height: '56px' }}>
          <NavbarTitleAndLogo
            variant="h6"
            display="flex"
            color={logoColor}
          />
          <LowerNavbarOptions />
        </Box>
      </Container>
    </Box>
  );
}
