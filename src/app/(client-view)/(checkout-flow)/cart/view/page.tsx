'use client';

import CartViewEmptyMessage from '@/components/CartViewEmptyMessage';
import LargeCartItem from '@/components/cartItems/largeCartItem/LargeCartItem';
import { useAppSelector } from '@/lib/redux/hooks';
import { Box, Grid } from '@mui/material';

export default function CartView() {
  const { cartItems } = useAppSelector((state) => state.cart);

  return (
    <>
      {cartItems.length === 0 ? <CartViewEmptyMessage /> : null}

      {cartItems.length !== 0 ? (
        <Grid
          component="ul"
          container
          rowSpacing={2}>
          {cartItems.map((item) => {
            return (
              <Grid
                component="li"
                key={item?.cartItemId}
                item
                xs={12}>
                <LargeCartItem item={item} />
              </Grid>
            );
          })}
        </Grid>
      ) : null}
    </>
  );
}
