'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { useEffect } from 'react';
import { CartItem } from '@/types';
import { setCartItems } from '@/lib/redux/slices/cartSlice';

type Props = {
  cartItems: CartItem[] | null;
};

export default function CartItemsStateSetter({ cartItems }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCartItems(cartItems !== null ? cartItems : []));
  }, [cartItems, dispatch]);

  return null;
}
