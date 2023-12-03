'use client';

import { ReactNode } from 'react';
import { Container } from '@mui/material';

export default function ProductLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Container
        sx={{
          padding: { xs: 0.75, sm: 0 },
          paddingBottom: { xs: 0 },
        }}
        disableGutters
        maxWidth="lg">
        {children}
      </Container>
    </>
  );
}
