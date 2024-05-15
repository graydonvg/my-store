'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { setWishlistData } from '@/lib/redux/slices/wishlistDataSlice';
import { WishlistData } from '@/types';
import { useEffect } from 'react';

type Props = {
  wishlistData: WishlistData[] | null;
};

export default function WishlistDataStateSetter({ wishlistData }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setWishlistData(wishlistData !== null ? wishlistData : []));
  }, [wishlistData, dispatch]);

  return null;
}
