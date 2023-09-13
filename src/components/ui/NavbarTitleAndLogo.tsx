import { Box, Typography } from '@mui/material';
import { ShoppingBasket } from '@mui/icons-material';

type NavbarTitleAndLogoProps = {
  display: 'flex' | { xs: 'flex'; md: 'none' };
  variant: 'h5' | 'h6';
  color: 'upperNavbar.text' | 'lowerNavbar.text';
};

export default function NavbarTitleAndLogo({ display, variant, color }: NavbarTitleAndLogoProps) {
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
