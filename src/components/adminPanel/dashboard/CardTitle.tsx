'use client';

import { useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

export default function CardTitle({ children }: Props) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Typography
      component="h2"
      variant="h6"
      gutterBottom
      color={darkMode ? theme.palette.primary.light : theme.palette.primary.main}
      sx={{ textTransform: 'capitalize' }}>
      {children}
    </Typography>
  );
}
