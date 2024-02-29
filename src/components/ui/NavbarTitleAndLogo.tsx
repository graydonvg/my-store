import { IconButton, Typography } from '@mui/material';
import { ShoppingBasket } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { STORE_NAME } from '@/config';

type Props = {
  display: 'flex' | { xs: 'flex'; md: 'none' };
  variant: 'h5' | 'h6';
  color: string;
  hideText?: boolean;
};

export default function NavbarTitleAndLogo({ display, variant, color, hideText = false }: Props) {
  const router = useRouter();

  function handleGoToHome() {
    router.push('/');
  }

  return (
    <IconButton
      onClick={handleGoToHome}
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
      <ShoppingBasket sx={{ color }} />
      {!hideText ? (
        <Typography
          tabIndex={-1}
          variant={variant}
          noWrap
          sx={{
            marginLeft: 1,
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '0.1rem',
            color,
            textDecoration: 'none',
          }}>
          {STORE_NAME}
        </Typography>
      ) : null}
    </IconButton>
  );
}
