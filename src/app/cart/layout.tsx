'use client';

import { ReactNode } from 'react';
import { Container } from '@mui/material';

export default function CartLayout({ children }: { children: ReactNode }) {
  return (
    <Container
      sx={{
        paddingTop: { xs: 1.75, sm: 0 },
        paddingX: { xs: 0.75, sm: 0 },
        paddingBottom: { xs: 0 },
      }}
      disableGutters
      maxWidth="lg">
      {children}
    </Container>
  );
}
