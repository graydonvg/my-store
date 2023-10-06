'use client';

import { Box, Container, useTheme } from '@mui/material';
import LowerNavbarOptions from './LowerNavbarOptions';
import NavbarTitleAndLogo from '../../../ui/NavbarTitleAndLogo';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';

export default function LowerNavbar() {
  const theme = useTheme();
  const color = useCustomColorPalette();
  const mode = theme.palette.mode;
  const backgroundColor = mode === 'light' ? color.grey.light : color.grey.medium;
  const logoColor = mode === 'light' ? color.grey.medium : color.grey.light;

  return (
    <Box
      component="div"
      position="sticky"
      sx={{ backgroundColor }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', height: 56 }}>
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
