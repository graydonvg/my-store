'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useEffect } from 'react';
import { CurrentUserType } from '@/types';
import { setCurrentUser, setIsOAuthSignIn } from '@/lib/redux/user/userSlice';
import DialogComponent from '../ui/DialogComponent';
import UpdateUserData from '../forms/UpdateUserData';
import { Session } from '@supabase/supabase-js';

type Props = {
  session: Session | null;
  userData: CurrentUserType;
};

export default function UserStateSetter({ session, userData }: Props) {
  const dispatch = useAppDispatch();
  const isUpdateDialogOpen = useAppSelector((state) => state.dialog.isUpdateDialogOpen);

  useEffect(() => {
    // const emptyFields = getEmptyFormFields(userData);

    // if (emptyFields.length > 0) {
    //   dispatch(setIsUpdateDialogOpen(true));
    // }

    if (session && session.user.app_metadata.provider !== 'email') {
      dispatch(setIsOAuthSignIn(true));
    } else {
      dispatch(setIsOAuthSignIn(false));
    }

    dispatch(setCurrentUser(userData));
  }, [userData, session, dispatch]);

  return (
    <DialogComponent isOpen={isUpdateDialogOpen}>
      <UpdateUserData />
    </DialogComponent>
  );
}
