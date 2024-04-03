import { IconButton, Typography } from '@mui/material';
import { ShoppingBasket } from '@mui/icons-material';
import { usePathname, useRouter, useSelectedLayoutSegment } from 'next/navigation';
import { STORE_NAME } from '@/config';
import useColorPalette from '@/hooks/useColorPalette';

type Props = {
  display: 'flex' | { xs: 'flex'; md: 'none' };
  variant: 'h5' | 'h6';
  color: string;
  hideText?: boolean;
};

export default function NavbarTitle({ display, variant, color, hideText = false }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin');
  const colorPalette = useColorPalette();
  const segment = useSelectedLayoutSegment();

  function navigateToHome() {
    router.push('/');
  }

  return (
    <>
      {!isAdminView ? (
        <IconButton
          onClick={navigateToHome}
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
      ) : (
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ textTransform: 'capitalize', color: colorPalette.typographyVariants.white }}>
          {segment}
        </Typography>
      )}
    </>
  );
}
