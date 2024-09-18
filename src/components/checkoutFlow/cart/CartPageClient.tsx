'use client';

import CartPageEmptyMessage from '@/components/checkoutFlow/cart/CartPageEmptyMessage';
import LargeCartItem from '@/components/cartItems/largeCartItem/LargeCartItem';
import { Grid2 } from '@mui/material';
import { CartItem, WishlistData } from '@/types';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setCartItems } from '@/lib/redux/features/cart/cartSlice';
import { setWishlistData } from '@/lib/redux/features/wishlistData/wishlistDataSlice';
import { resetCheckoutData } from '@/lib/redux/features/checkout/checkoutSlice';
import { selectCartItemsWithPriceDetails } from '@/lib/redux/features/cart/cartSelectors';

type Props = {
  cartItems: CartItem[] | null;
  wishlistData: WishlistData[] | null;
};

export default function CartPageClient({ cartItems, wishlistData }: Props) {
  const dispatch = useAppDispatch();
  const cartItemsWithPriceDetails = useAppSelector(selectCartItemsWithPriceDetails);

  useEffect(() => {
    dispatch(setCartItems(cartItems ?? []));
    dispatch(setWishlistData(wishlistData ?? []));
    dispatch(resetCheckoutData());
  }, [cartItems, wishlistData, dispatch]);

  return (
    <>
      {cartItemsWithPriceDetails?.length > 0 ? (
        <Grid2
          component="ul"
          container
          rowSpacing={2}>
          {cartItemsWithPriceDetails.map((item) => {
            return (
              <Grid2
                component="li"
                key={item?.cartItemId}
                size={{ xs: 12 }}>
                <LargeCartItem item={item} />
              </Grid2>
            );
          })}
        </Grid2>
      ) : (
        <CartPageEmptyMessage />
      )}
    </>
  );
}
