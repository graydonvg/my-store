'use client';

import { BORDER_RADIUS } from '@/data';
import { Box, useTheme } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function WelcomePageFormContainer({ children }: Props) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        margin: '0 auto',
        boxShadow: 5,
        borderRadius: BORDER_RADIUS,
        overflow: 'hidden',
        maxWidth: 400,
        backgroundColor: theme.palette.custom.dialog.background.primary,
      }}>
      {children}
    </Box>
  );
}
