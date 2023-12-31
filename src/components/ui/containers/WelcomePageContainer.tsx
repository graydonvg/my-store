'use client';

import { borderRadius } from '@/constants/styles';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { Box, useTheme } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function WelcomePageContainer({ children }: Props) {
  const theme = useTheme();
  const customColorPalette = useCustomColorPalette();
  const mode = theme.palette.mode;

  return (
    <Box
      sx={{
        margin: '0 auto',
        boxShadow: 5,
        borderRadius: borderRadius,
        padding: 4,
        maxWidth: 400,
        backgroundColor: mode === 'dark' ? customColorPalette.grey.dark : 'white',
      }}>
      {children}
    </Box>
  );
}
