'use client';

import { Box, Typography, useTheme } from '@mui/material';
import { ShoppingBasket } from '@mui/icons-material';

type NavbarTitleAndLogoProps = {
  display: 'flex' | { xs: 'flex'; md: 'none' };
  variant: 'h5' | 'h6';
  color: string;
};

export default function NavbarTitleAndLogo({ display, variant, color }: NavbarTitleAndLogoProps) {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const labelTextColor = mode === 'light' ? 'custom.grey.medium' : 'custom.grey.light';

  return (
    <Box sx={{ display, alignItems: 'center' }}>
      <ShoppingBasket sx={{ mr: 1, color }} />
      <Typography
        tabIndex={-1}
        variant={variant}
        noWrap
        component="a"
        href="/"
        sx={{
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.1rem',
          color,
          textDecoration: 'none',
        }}>
        MyStore
      </Typography>
    </Box>
  );
}
