'use client';

import { Box, Container } from '@mui/material';
import UpperNavbarOptions from './UpperNavbarOptions';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';

export default function UpperNavbar() {
  const customColorPalette = useCustomColorPalette();

  return (
    <Box sx={{ backgroundColor: customColorPalette.grey.dark }}>
      <Container
        maxWidth="lg"
        disableGutters>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'space-between', md: 'flex-end' },
            height: { xs: '64px', md: '40px' },
          }}>
          <UpperNavbarOptions />
        </Box>
      </Container>
    </Box>
  );
}
