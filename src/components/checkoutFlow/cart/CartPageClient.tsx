'use client';

import CartPageEmptyMessage from '@/components/checkoutFlow/cart/CartPageEmptyMessage';
import LargeCartItem from '@/components/cartItems/largeCartItem/LargeCartItem';
import { Grid } from '@mui/material';
import { CartItem, WishlistData } from '@/types';
import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setCartItems } from '@/lib/redux/features/cart/cartSlice';
import { setWishlistData } from '@/lib/redux/features/wishlistData/wishlistDataSlice';
import { resetCheckoutData } from '@/lib/redux/features/checkout/checkoutSlice';

type Props = {
  cartItems: CartItem[] | null;
  wishlistData: WishlistData[] | null;
};

export default function CartPageClient({ cartItems, wishlistData }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCartItems(cartItems ?? []));
    dispatch(setWishlistData(wishlistData ?? []));
    dispatch(resetCheckoutData());
  }, [cartItems, wishlistData, dispatch]);

  return (
    <>
      {!cartItems || cartItems.length === 0 ? (
        <CartPageEmptyMessage />
      ) : (
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
      )}
    </>
  );
}
