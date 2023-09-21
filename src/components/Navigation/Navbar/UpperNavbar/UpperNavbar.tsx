'use client';

import { Box, Container } from '@mui/material';
import UpperNavbarOptions from './UpperNavbarOptions';

export default function UpperNavbar() {
  return (
    <Box
      id="upper-nav"
      sx={{ backgroundColor: 'custom.grey.dark' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'space-between', md: 'flex-end' },
            height: { xs: '56px', md: '40px' },
          }}>
          <UpperNavbarOptions />
        </Box>
      </Container>
    </Box>
  );
}
