'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { useEffect } from 'react';
import { UserData } from '@/types';
import { setUserData } from '@/lib/redux/slices/userSlice';

type Props = {
  userData: UserData | null;
};

export default function UserStateSetter({ userData }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userData && userData.userId) {
      dispatch(setUserData(userData));
    } else {
      dispatch(setUserData(null));
    }
  }, [userData, dispatch]);

  return null;
}
