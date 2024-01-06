'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { useEffect } from 'react';
import { CurrentUserType } from '@/types';
import { setCurrentUser, setIsOAuthSignIn } from '@/lib/redux/user/userSlice';
import { Session } from '@supabase/supabase-js';

type Props = {
  session: Session | null;
  userData: CurrentUserType | null;
};

export default function UserStateSetter({ session, userData }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!!userData && !!userData.userId) {
      dispatch(setCurrentUser(userData));
    } else {
      dispatch(setCurrentUser(null));
    }

    if (!!session && session.user.app_metadata.provider !== 'email') {
      dispatch(setIsOAuthSignIn(true));
    } else {
      dispatch(setIsOAuthSignIn(false));
    }
  }, [userData, session, dispatch]);

  return null;
}
