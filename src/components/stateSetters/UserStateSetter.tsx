'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useEffect } from 'react';
import { CurrentUserType } from '@/types';
import { setCurrentUser, setIsOAuthSignIn } from '@/lib/redux/user/userSlice';
import ModalComponent from '../ui/ModalComponent';
import UpdateUserData from '../forms/UpdateUserData';
import { Session } from '@supabase/supabase-js';

type Props = {
  session: Session | null;
  userData: CurrentUserType;
};

export default function UserStateSetter({ session, userData }: Props) {
  const dispatch = useAppDispatch();
  const isUpdateModalOpen = useAppSelector((state) => state.modal.isUpdateModalOpen);

  useEffect(() => {
    // const emptyFields = getEmptyFormFields(userData);

    // if (emptyFields.length > 0) {
    //   dispatch(setIsUpdateModalOpen(true));
    // }

    if (session && session.user.app_metadata.provider !== 'email') {
      dispatch(setIsOAuthSignIn(true));
    } else {
      dispatch(setIsOAuthSignIn(false));
    }

    dispatch(setCurrentUser(userData));
  }, [userData, session, dispatch]);

  return (
    <ModalComponent isOpen={isUpdateModalOpen}>
      <UpdateUserData />
    </ModalComponent>
  );
}
