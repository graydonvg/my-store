'use client';

import { setCartItems } from '@/lib/redux/features/cart/cartSlice';
import { setUserData } from '@/lib/redux/features/user/userSlice';
import { setWishlistData } from '@/lib/redux/features/wishlistData/wishlistDataSlice';
import { CartItem, UserData, WishlistData } from '@/types';
import { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';

type Props = {
  userData: UserData | null;
  cartItems: CartItem[] | null;
  wishlistData: WishlistData[] | null;
  children: ReactNode;
};

export default function DataInitializer({ userData, cartItems, wishlistData, children }: Props) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUserData(userData));
    dispatch(setCartItems(cartItems ?? []));
    dispatch(setWishlistData(wishlistData ?? []));
  }, [dispatch, userData, cartItems, wishlistData]);

  return children;
}
