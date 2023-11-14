'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { useEffect } from 'react';
import { CurrentUserType } from '@/types';
import { setCurrentUser } from '@/lib/redux/user/userSlice';
import { getEmptyFormFields } from '@/lib/utils';
import useOpenModal from '@/hooks/useOpenModal';

type Props = {
  userData: CurrentUserType;
};

export default function UserStateSetter({ userData }: Props) {
  const dispatch = useAppDispatch();
  const handleOpenModal = useOpenModal();

  useEffect(() => {
    const emptyFields = getEmptyFormFields(userData);

    if (emptyFields.length > 0) {
      handleOpenModal('update');
    }

    dispatch(setCurrentUser(userData));
  }, [userData, dispatch, handleOpenModal]);

  return null;
}
