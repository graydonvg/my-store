import { BORDER_RADIUS } from '@/config';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';

export default function CartViewEmptyMessage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        height: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: (theme) => theme.palette.custom.card.background,
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
          sx={{ textDecoration: 'underline', color: (theme) => theme.palette.custom.primary.dark }}>
          Continue shopping
        </Typography>
      </Link>
    </Box>
  );
}
