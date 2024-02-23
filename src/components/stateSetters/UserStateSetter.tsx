'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { useEffect } from 'react';
import { UserDataType } from '@/types';
import { setUserData, setIsOAuthSignIn } from '@/lib/redux/slices/userSlice';
import { User } from '@supabase/supabase-js';

type Props = {
  user: User | null;
  userData: UserDataType | null;
};

export default function UserStateSetter({ user, userData }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userData && userData.userId) {
      dispatch(setUserData(userData));
    } else {
      dispatch(setUserData(null));
    }

    if (user && user.app_metadata.provider !== 'email') {
      dispatch(setIsOAuthSignIn(true));
    } else {
      dispatch(setIsOAuthSignIn(false));
    }
  }, [userData, user, dispatch]);

  return null;
}
