'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { useEffect } from 'react';
import { CurrentUserType } from '@/types';
import { setCurrentUser } from '@/lib/redux/user/userSlice';
import { getEmptyFormFields } from '@/lib/utils';
import { setIsModalOpen, setModalContent } from '@/lib/redux/modal/modalSlice';

type UserStateSetterProps = {
  userData: CurrentUserType;
};

export default function UserStateSetter({ userData }: UserStateSetterProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const emptyFields = getEmptyFormFields(userData);

    if (emptyFields.length > 0) {
      dispatch(setModalContent('updateUserData'));
      dispatch(setIsModalOpen(true));
    }

    dispatch(setCurrentUser(userData));
  }, [userData, dispatch]);

  return null;
}
