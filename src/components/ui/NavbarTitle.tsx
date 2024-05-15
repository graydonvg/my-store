import { IconButton, SxProps, Theme, Typography, TypographyProps } from '@mui/material';
import { ShoppingBasket } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { STORE_NAME } from '@/data';

type Props = {
  hideText?: boolean;
  iconButtonSxStyles?: SxProps<Theme> | undefined;
  typographySxStyles?: SxProps<Theme> | undefined;
} & TypographyProps;

export default function NavbarTitle({
  hideText = false,
  iconButtonSxStyles,
  typographySxStyles,
  ...typographyProps
}: Props) {
  const router = useRouter();

  function navigateToHome() {
    router.push('/');
  }

  return (
    <IconButton
      onClick={navigateToHome}
      sx={{
        paddingX: 0,
        alignItems: 'center',
        textTransform: 'none',
        '@media (hover: hover)': {
          '&:hover': {
            backgroundColor: 'transparent',
          },
        },
        ...iconButtonSxStyles,
      }}>
      <ShoppingBasket sx={{ color: 'inherit' }} />

      {!hideText ? (
        <Typography
          tabIndex={-1}
          noWrap
          sx={{
            marginLeft: 1,
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '0.1rem',
            color: 'inherit',
            textDecoration: 'none',
            ...typographySxStyles,
          }}
          {...typographyProps}>
          {STORE_NAME}
        </Typography>
      ) : null}
    </IconButton>
  );
}
