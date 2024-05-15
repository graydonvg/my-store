import { BORDER_RADIUS } from '@/data';
import { Paper, Typography } from '@mui/material';
import Link from 'next/link';

export default function CartPageEmptyMessage() {
  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        height: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
          sx={{ textDecoration: 'underline', color: (theme) => theme.palette.primary.main }}>
          Continue shopping
        </Typography>
      </Link>
    </Paper>
  );
}
