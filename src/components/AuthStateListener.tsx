'use client';

import { getUserDoc, onAuthStateChangedListener } from '@/lib/firebase';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setCurrentUser } from '@/lib/redux/user/userSlice';
import { CurrentUserType } from '@/types';
import { useEffect } from 'react';

export default function AuthStateListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async () => {
      const userDoc = await getUserDoc();

      const selectedUserDetails =
        userDoc &&
        (({ displayName, firstName, lastName, email, isAdmin }) => ({
          displayName,
          firstName,
          lastName,
          email,
          isAdmin,
        }))(userDoc);

      dispatch(setCurrentUser(selectedUserDetails as CurrentUserType));
    });
    return unsubscribe;
  }, [dispatch]);

  return null;
}
