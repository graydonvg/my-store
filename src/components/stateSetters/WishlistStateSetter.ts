'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { setWishlistItems } from '@/lib/redux/slices/wishlistSlice';
import { WishlistStoreType } from '@/types';
import { useEffect } from 'react';

type Props = {
  wishlistItems: WishlistStoreType[] | null;
};

export default function WishlistStateSetter({ wishlistItems }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setWishlistItems(wishlistItems !== null ? wishlistItems : []));
  }, [wishlistItems, dispatch]);

  return null;
}
