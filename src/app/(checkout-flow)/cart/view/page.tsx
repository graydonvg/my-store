'use client';

import LargeCartItem from '@/components/cartItems/largeCartItem/LargeCartItem';
import { BORDER_RADIUS } from '@/config';
import useColorPalette from '@/hooks/useColorPalette';
import { useAppSelector } from '@/lib/redux/hooks';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';

export default function CartView() {
  const colorPalette = useColorPalette();
  const { cartItems } = useAppSelector((state) => state.cart);

  return (
    <>
      {cartItems.length === 0 ? (
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
      ) : null}

      {cartItems.length !== 0
        ? cartItems.map((item, index) => {
            const isLastItem = cartItems.length - 1 === index;

            return (
              <Box
                key={item?.cartItemId}
                sx={{ marginBottom: isLastItem ? 0 : 2 }}>
                <LargeCartItem item={item} />
              </Box>
            );
          })
        : null}
    </>
  );
}
