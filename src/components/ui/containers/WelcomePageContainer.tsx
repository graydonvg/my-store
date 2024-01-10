'use client';

import { borderRadius } from '@/constants/styles';
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
        borderRadius: borderRadius,
        padding: 4,
        maxWidth: 400,
        backgroundColor: colorPalette.card.background,
      }}>
      {children}
    </Box>
  );
}
