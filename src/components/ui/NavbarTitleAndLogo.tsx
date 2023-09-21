import { Box, Typography } from '@mui/material';
import { ShoppingBasket } from '@mui/icons-material';

type TitleAndLogoProps = {
  display: 'flex' | { xs: 'flex'; md: 'none' };
  variant: 'h5' | 'h6';
  color: string;
};

export default function NavbarTitleAndLogo({ display, variant, color }: TitleAndLogoProps) {
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
          letterSpacing: '0.1rem',
          color,
          textDecoration: 'none',
        }}>
        MyStore
      </Typography>
    </Box>
  );
}
