import { IconButton, Typography } from '@mui/material';
import { ShoppingBasket } from '@mui/icons-material';
import { usePathname, useRouter, useSelectedLayoutSegments } from 'next/navigation';
import { STORE_NAME } from '@/config';

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
  const segments = useSelectedLayoutSegments();
  const currentPath = segments.at(-1)?.split('-').join(' ') ?? '';

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
          sx={{ textTransform: 'capitalize', color: (theme) => theme.palette.custom.typographyVariants.white }}>
          {currentPath}
        </Typography>
      )}
    </>
  );
}
