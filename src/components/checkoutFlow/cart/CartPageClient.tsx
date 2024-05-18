'use client';

import CartPageEmptyMessage from '@/components/checkoutFlow/cart/CartPageEmptyMessage';
import LargeCartItem from '@/components/cartItems/largeCartItem/LargeCartItem';
import { Grid } from '@mui/material';
import { CartItem, CustomResponse, WishlistData } from '@/types';
import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setCartItems } from '@/lib/redux/features/cart/cartSlice';
import { setWishlistData } from '@/lib/redux/features/wishlistData/wishlistDataSlice';
import { resetCheckoutData } from '@/lib/redux/features/checkout/checkoutSlice';
import { toast } from 'react-toastify';

type Props = {
  cartItems: CartItem[] | null;
  wishlistData: WishlistData[] | null;
  clearCheckoutData: boolean;
  deleteCancelledOrderResponse: CustomResponse;
};

export default function CartPageClient({
  cartItems,
  wishlistData,
  clearCheckoutData,
  deleteCancelledOrderResponse,
}: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCartItems(cartItems ?? []));
    dispatch(setWishlistData(wishlistData ?? []));
  }, [cartItems, wishlistData, dispatch]);

  useEffect(() => {
    if (clearCheckoutData) {
      dispatch(resetCheckoutData());
    }
  }, [clearCheckoutData, dispatch]);

  useEffect(() => {
    if (!deleteCancelledOrderResponse.success) {
      toast.error(deleteCancelledOrderResponse.message);
    }
  }, [deleteCancelledOrderResponse.success, deleteCancelledOrderResponse.message]);

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
