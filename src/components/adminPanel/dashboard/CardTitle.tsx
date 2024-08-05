'use client';

import { useTheme } from '@mui/material';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { ReactNode } from 'react';

type Props = TypographyProps & {
  children?: ReactNode;
};

export default function CardTitle({ children, ...props }: Props) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Typography
      component="h2"
      variant="h6"
      color={darkMode ? theme.palette.primary.light : theme.palette.primary.main}
      sx={{ textTransform: 'capitalize' }}
      {...props}>
      {children}
    </Typography>
  );
}
