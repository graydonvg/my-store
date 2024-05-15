'use client';

import CartPageEmptyMessage from '@/components/checkoutFlow/CartPageEmptyMessage';
import LargeCartItem from '@/components/cartItems/largeCartItem/LargeCartItem';
import { Grid } from '@mui/material';
import { CartItem } from '@/types';

type Props = {
  cartItems: CartItem[] | null;
};

export default function CartPageClient({ cartItems }: Props) {
  return (
    <>
      {!cartItems ? <CartPageEmptyMessage /> : null}

      {cartItems ? (
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
