'use client';

import { ReactNode } from 'react';
import WelcomePageNavbar from '@/components/navbars/WelcomePageNavbar';
import { Box, Container } from '@mui/material';
import { constants } from '@/constants';

export default function WelcomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <WelcomePageNavbar />
      <Container
        component="main"
        maxWidth="lg"
        sx={{ paddingY: { xs: 2, sm: 6 } }}>
        <Box
          sx={{
            margin: '0 auto',
            boxShadow: 5,
            borderRadius: constants.borderRadius,
            overflow: 'hidden',
            maxWidth: 400,
            backgroundColor: (theme) => theme.palette.custom.dialog.background.primary,
          }}>
          {children}
        </Box>
      </Container>
    </>
  );
}
