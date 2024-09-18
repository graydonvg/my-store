import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography, { TypographyProps } from '@mui/material/Typography';
import ShoppingBasket from '@mui/icons-material/ShoppingBasket';
import { CONSTANTS } from '@/constants';

type Props = {
  color: string;
  showOnSmallScreen?: boolean;
} & TypographyProps;

export default function NavbarTitle({ color, showOnSmallScreen = true, ...typographyProps }: Props) {
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
          {CONSTANTS.STORE_NAME}
        </Typography>
      </Box>
    </Link>
  );
}
