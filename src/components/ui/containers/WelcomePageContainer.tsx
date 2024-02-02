'use client';

import { BORDER_RADIUS } from '@/config';
import useColorPalette from '@/hooks/useColorPalette';
import { Box, useTheme } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function WelcomePageContainer({ children }: Props) {
  const colorPalette = useColorPalette();

  return (
    <Box
      sx={{
        margin: '0 auto',
        boxShadow: 5,
        borderRadius: BORDER_RADIUS,
        padding: 4,
        maxWidth: 400,
        backgroundColor: colorPalette.card.background,
      }}>
      {children}
    </Box>
  );
}
