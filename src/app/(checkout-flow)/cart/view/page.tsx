'use client';

import CartViewEmptyMessage from '@/components/CartViewEmptyMessage';
import LargeCartItem from '@/components/cartItems/largeCartItem/LargeCartItem';
import { useAppSelector } from '@/lib/redux/hooks';
import { Box } from '@mui/material';

export default function CartView() {
  const { cartItems } = useAppSelector((state) => state.cart);

  return (
    <>
      {cartItems.length === 0 ? <CartViewEmptyMessage /> : null}

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
