'use client';

import { CONSTANTS } from '@/constants';
import { darken, Paper } from '@mui/material';
import { ReactNode } from 'react';

export function AdminDashboardCard({ children }: { children: ReactNode }) {
  return (
    <Paper
      sx={{
        borderRadius: CONSTANTS.BORDER_RADIUS,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? darken(theme.palette.grey[900], 0.3) : theme.palette.background.paper,
      }}>
      {children}
    </Paper>
  );
}