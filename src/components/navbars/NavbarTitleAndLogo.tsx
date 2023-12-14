import { Button, Typography } from '@mui/material';
import { ShoppingBasket } from '@mui/icons-material';
import Link from 'next/link';

type TitleAndLogoProps = {
  display: 'flex' | { xs: 'flex'; md: 'none' };
  variant: 'h5' | 'h6';
  color: string;
  hideText?: boolean;
};

export default function NavbarTitleAndLogo({ display, variant, color, hideText = false }: TitleAndLogoProps) {
  return (
    <Link
      href={'/'}
      tabIndex={-1}>
      <Button
        disableTouchRipple
        sx={{
          display,
          paddingX: 0,
          alignItems: 'center',
          textTransform: 'none',
          '@media (hover: hover)': {
            '&:hover': {
              backgroundColor: 'transparent',
            },
          },
        }}>
        <ShoppingBasket sx={{ mr: 1, color }} />
        {!hideText ? (
          <Typography
            tabIndex={-1}
            variant={variant}
            noWrap
            sx={{
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '0.1rem',
              color,
              textDecoration: 'none',
            }}>
            MyStore
          </Typography>
        ) : null}
      </Button>
    </Link>
  );
}
