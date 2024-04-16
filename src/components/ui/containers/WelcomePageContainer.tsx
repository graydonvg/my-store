'use client';

import { BORDER_RADIUS } from '@/config';
import { Box } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function WelcomePageContainer({ children }: Props) {
  return (
    <Box
      sx={{
        margin: '0 auto',
        boxShadow: 5,
        borderRadius: BORDER_RADIUS,
        padding: 4,
        maxWidth: 400,
        backgroundColor: (theme) => theme.palette.custom.card.background,
      }}>
      {children}
    </Box>
  );
}
