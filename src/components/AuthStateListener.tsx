'use client';

import { createUserDocumentFromAuth, onAuthStateChangedListener } from '@/lib/firebase';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setCurrentUser } from '@/lib/redux/user/userSlice';
import { CurrentUserType } from '@/types';
import { useEffect } from 'react';

export default function AuthStateListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        const displayName = user.displayName;
        createUserDocumentFromAuth({ displayName });
      }

      const selectedUserDetails = user && (({ displayName, email }) => ({ displayName, email }))(user);

      dispatch(setCurrentUser(selectedUserDetails as CurrentUserType));
    });
    return unsubscribe;
  }, [dispatch]);

  return null;
}
