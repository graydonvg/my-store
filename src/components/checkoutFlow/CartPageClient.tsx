'use client';

import CartPageEmptyMessage from '@/components/checkoutFlow/CartPageEmptyMessage';
import LargeCartItem from '@/components/cartItems/largeCartItem/LargeCartItem';
import { Grid } from '@mui/material';
import { CartItem, WishlistData } from '@/types';
import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setCartItems } from '@/lib/redux/features/cart/cartSlice';
import { setWishlistData } from '@/lib/redux/features/wishlistData/wishlistDataSlice';

type Props = {
  cartItems: CartItem[] | null;
  wishlistData: WishlistData[] | null;
};

export default function CartPageClient({ cartItems, wishlistData }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Dispatch to store to perform checks when editing cart
    dispatch(setCartItems(cartItems ?? []));
    dispatch(setWishlistData(wishlistData ?? []));
  }, [cartItems, wishlistData, dispatch]);

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
