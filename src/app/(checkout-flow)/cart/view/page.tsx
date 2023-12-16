'use client';

import CartItemLarge from '@/components/CartItemLarge';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppSelector } from '@/lib/redux/hooks';
import { Box, List, Typography, useTheme } from '@mui/material';
import Link from 'next/link';

export default function CartView() {
  const { cartItems } = useAppSelector((state) => state.cart);
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const cardBackgroundColor = mode === 'dark' ? customColorPalette.grey.dark : 'white';

  return (
    <List
      disablePadding
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: 1 }}>
      {cartItems && cartItems.length > 0 ? (
        cartItems.map((item) => (
          <CartItemLarge
            key={item?.cart_item_id}
            item={item}
          />
        ))
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            height: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: cardBackgroundColor,
            borderRadius: '4px',
            paddingX: 2,
            paddingY: 4,
          }}>
          <Typography
            component="h1"
            fontSize={30}>
            Your cart is empty
          </Typography>
          <Link href={'/products/all-products'}>
            <Typography
              component="p"
              fontSize={24}
              sx={{ textDecoration: 'underline', color: customColorPalette.blue.dark }}>
              Continue shopping
            </Typography>
          </Link>
        </Box>
      )}
    </List>
  );
}
