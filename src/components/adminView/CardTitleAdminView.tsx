'use client';

import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

export default function CardTitleAdminView({ children }: Props) {
  return (
    <Typography
      component="h2"
      variant="h6"
      color={(theme) =>
        theme.palette.mode === 'dark' ? theme.palette.custom.primary.light : theme.palette.custom.primary.dark
      }
      gutterBottom
      sx={{ textTransform: 'capitalize' }}>
      {children}
    </Typography>
  );
}
