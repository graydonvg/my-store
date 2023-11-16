'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { useEffect } from 'react';
import { CartItemType } from '@/types';
import { setCartItems } from '@/lib/redux/cart/cartSlice';

type Props = {
  cartItems: CartItemType[];
};

export default function CartItemsStateSetter({ cartItems }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCartItems(cartItems));
  }, [cartItems, dispatch]);

  return null;
}
