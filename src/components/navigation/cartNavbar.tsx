'use client';

import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import NavbarTitleAndLogo from '../ui/NavbarTitleAndLogo';
import IconBreadcrumbs from '../ui/IconBreadcrumbs';

export default function CartNavbar() {
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
            <IconBreadcrumbs hideText={isBelowSmall ? true : false} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
