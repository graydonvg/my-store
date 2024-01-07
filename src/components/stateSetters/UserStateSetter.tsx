'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { useEffect } from 'react';
import { UserDataType } from '@/types';
import { setUserData, setIsOAuthSignIn } from '@/lib/redux/user/userSlice';
import { Session } from '@supabase/supabase-js';

type Props = {
  session: Session | null;
  userData: UserDataType | null;
};

export default function UserStateSetter({ session, userData }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!!userData && !!userData.userId) {
      dispatch(setUserData(userData));
    } else {
      dispatch(setUserData(null));
    }

    if (!!session && session.user.app_metadata.provider !== 'email') {
      dispatch(setIsOAuthSignIn(true));
    } else {
      dispatch(setIsOAuthSignIn(false));
    }
  }, [userData, session, dispatch]);

  return null;
}
