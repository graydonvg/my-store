'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useEffect } from 'react';
import { CurrentUserType } from '@/types';
import { setCurrentUser } from '@/lib/redux/user/userSlice';
import { getEmptyFormFields } from '@/lib/utils';
import ModalComponent from '../ui/ModalComponent';
import UpdateUserData from '../forms/UpdateUserData';
import { setIsUpdateModalOpen } from '@/lib/redux/modal/modalSlice';

type Props = {
  userData: CurrentUserType;
};

export default function UserStateSetter({ userData }: Props) {
  const dispatch = useAppDispatch();
  const isUpdateModalOpen = useAppSelector((state) => state.modal.isUpdateModalOpen);

  useEffect(() => {
    const emptyFields = getEmptyFormFields(userData);

    if (emptyFields.length > 0) {
      dispatch(setIsUpdateModalOpen(true));
    }

    dispatch(setCurrentUser(userData));
  }, [userData, dispatch]);

  return (
    <ModalComponent isOpen={isUpdateModalOpen}>
      <UpdateUserData />
    </ModalComponent>
  );
}
