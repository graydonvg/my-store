'use client';

import { ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';

export default function CartLayout({ children }: { children: ReactNode }) {
  const customColorPalette = useCustomColorPalette();
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
