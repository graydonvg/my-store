'use client';

import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import NavbarTitleAndLogo from '../ui/NavbarTitleAndLogo';
import CheckoutBreadcrumbs from '../ui/CheckoutBreadcrumbs';

export default function CheckoutNavbar() {
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ backgroundColor: customColorPalette.grey.dark }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: { xs: '64px', md: '40px' },
            flexGrow: 1,
            gap: 2,
          }}>
          <NavbarTitleAndLogo
            hideText={isBelowSmall ? true : false}
            variant="h5"
            display="flex"
            color={customColorPalette.grey.light}
          />
          <Box sx={{ margin: '0 auto' }}>
            <CheckoutBreadcrumbs />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
