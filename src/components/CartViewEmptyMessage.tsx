import { BORDER_RADIUS } from '@/config';
import useColorPalette from '@/hooks/useColorPalette';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';

export default function CartViewEmptyMessage() {
  const colorPalette = useColorPalette();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        height: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colorPalette.card.background,
        borderRadius: BORDER_RADIUS,
        paddingX: 2,
        paddingY: 4,
      }}>
      <Typography
        component="p"
        fontSize={30}>
        Your cart is empty
      </Typography>
      <Link href={'/products/all-products'}>
        <Typography
          component="p"
          fontSize={24}
          sx={{ textDecoration: 'underline', color: colorPalette.primary.dark }}>
          Continue shopping
        </Typography>
      </Link>
    </Box>
  );
}
