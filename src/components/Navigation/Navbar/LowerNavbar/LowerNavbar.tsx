'use client';

import { Box, Container, useTheme } from '@mui/material';
import LowerNavbarOptions from './LowerNavbarOptions';
import NavbarTitleAndLogo from '../../../ui/NavbarTitleAndLogo';

export default function LowerNavbar() {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const backgroundColor = mode === 'light' ? 'custom.grey.light' : 'custom.grey.medium';
  const logoColor = mode === 'light' ? 'custom.grey.medium' : 'custom.grey.light';

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
