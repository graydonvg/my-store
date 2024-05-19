import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography, { TypographyProps } from '@mui/material/Typography';
import ShoppingBasket from '@mui/icons-material/ShoppingBasket';
import { Theme } from '@mui/material';
import { STORE_NAME } from '@/data';

type Props = {
  color: (theme: Theme) => string;
  showOnSmallScreen?: boolean;
} & TypographyProps;

export default function NavbarTitle({
  color = (theme: Theme) => theme.palette.common.white,
  showOnSmallScreen = true,
  ...typographyProps
}: Props) {
  return (
    <Link href="/">
      <Box
        sx={{
          color,
          display: 'flex',
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

        <Typography
          noWrap
          sx={{
            color,
            display: { xs: showOnSmallScreen ? 'block' : 'none', md: 'block' },
            marginLeft: 1,
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '0.1rem',
            textDecoration: 'none',
          }}
          {...typographyProps}>
          {STORE_NAME}
        </Typography>
      </Box>
    </Link>
  );
}
