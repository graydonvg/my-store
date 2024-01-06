'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import AccountPageInfo from '../AccountPageInfo';
import AccountPageInfoInput from '../AccountPageInfoInput';
import {
  setFieldToEdit,
  setIsUpdatingAccount,
  setPersonalInformation,
  setPersonalInformationOnChange,
} from '@/lib/redux/account/accountSlice';
import { ChangeEvent, ReactNode, useEffect } from 'react';
import { setCurrentUser } from '@/lib/redux/user/userSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { updateUserPersonalInformation } from '@/services/users/update-user';
import { AccountTextFieldData, PersonalInformationType } from '@/types';

type UserDataProps = {
  show: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
};

function UserData({ show, label, onClick, children }: UserDataProps) {
  if (!show) return null;

  return (
    <AccountPageInfo
      label={label}
      canEdit={true}
      onClick={onClick}>
      {children}
    </AccountPageInfo>
  );
}

type UpdateUserDataProps = {
  show: boolean;
  isUpdating: boolean;
  onSave: () => void;
  onCancel: () => void;
  value: string;
  textFieldData: AccountTextFieldData[];
};

function UpdateUserData({ show, isUpdating, onSave, onCancel, value, textFieldData }: UpdateUserDataProps) {
  if (!show) return null;

  return (
    <AccountPageInfoInput
      textFieldData={textFieldData}
      isUpdating={isUpdating}
      onSave={onSave}
      onCancel={onCancel}
      disableSave={value.length === 0}
    />
  );
}

type PersonalInformationProps = {
  renderUserInfo: (value: string) => ReactNode;
};

export default function PersonalInformation({ renderUserInfo }: PersonalInformationProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const { personalInformation, fieldToEdit, isUpdatingAccount } = useAppSelector((state) => state.account);

  useEffect(() => {
    dispatch(
      setPersonalInformation({
        name: currentUser?.firstName ?? '',
        surname: currentUser?.lastName ?? '',
        contactNumber: currentUser?.contactNumber ?? '',
      })
    );
  }, [dispatch, currentUser?.firstName, currentUser?.lastName, currentUser?.contactNumber]);

  function handleSetFieldToEdit(field: string) {
    dispatch(setFieldToEdit(field));
  }

  function handleCancelUpdateField() {
    dispatch(setFieldToEdit(null));
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    dispatch(setPersonalInformationOnChange({ field: name as keyof PersonalInformationType, value }));
  }

  async function handleUpdatePersonalInformation() {
    if (
      personalInformation.name === currentUser?.firstName &&
      personalInformation.surname === currentUser.lastName &&
      personalInformation.contactNumber === currentUser.contactNumber
    )
      return;

    dispatch(setIsUpdatingAccount(true));

    const userInfo = {
      firstName: personalInformation.name,
      lastName: personalInformation.surname,
      contactNumber: personalInformation.contactNumber,
    };

    try {
      const { success, message } = await updateUserPersonalInformation(userInfo);

      if (success === true) {
        dispatch(
          setCurrentUser({
            ...currentUser!,
            ...userInfo,
          })
        );

        dispatch(setFieldToEdit(null));

        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error('Failed to update personal information. Please try again later.');
    } finally {
      router.refresh();
      dispatch(setIsUpdatingAccount(false));
    }
  }

  return (
    <>
      <UserData
        show={fieldToEdit !== 'name'}
        label="Name"
        onClick={() => handleSetFieldToEdit('name')}>
        {renderUserInfo(currentUser?.firstName!)}
      </UserData>
      <UpdateUserData
        show={fieldToEdit === 'name'}
        textFieldData={[
          {
            id: 'name',
            label: 'Name',
            name: 'name',
            type: 'text',
            value: personalInformation.name,
            onChange: handleInputChange,
            onKeyDownFunction: handleUpdatePersonalInformation,
          },
        ]}
        isUpdating={isUpdatingAccount}
        onCancel={handleCancelUpdateField}
        onSave={handleUpdatePersonalInformation}
        value={personalInformation.name}
      />
      <UserData
        show={fieldToEdit !== 'surname'}
        label="Surname"
        onClick={() => handleSetFieldToEdit('surname')}>
        {renderUserInfo(currentUser?.lastName!)}
      </UserData>
      <UpdateUserData
        show={fieldToEdit === 'surname'}
        textFieldData={[
          {
            id: 'surname',
            label: 'Surname',
            name: 'surname',
            type: 'text',
            value: personalInformation.surname,
            onChange: handleInputChange,
            onKeyDownFunction: handleUpdatePersonalInformation,
          },
        ]}
        isUpdating={isUpdatingAccount}
        onCancel={handleCancelUpdateField}
        onSave={handleUpdatePersonalInformation}
        value={personalInformation.surname}
      />
      <UserData
        show={fieldToEdit !== 'contactNumber'}
        label="Contact number"
        onClick={() => handleSetFieldToEdit('contactNumber')}>
        {renderUserInfo(currentUser?.contactNumber!)}
      </UserData>
      <UpdateUserData
        show={fieldToEdit === 'contactNumber'}
        textFieldData={[
          {
            id: 'contact-number',
            label: 'Contact number',
            name: 'contactNumber',
            type: 'text',
            value: personalInformation.contactNumber,
            onChange: handleInputChange,
            onKeyDownFunction: handleUpdatePersonalInformation,
          },
        ]}
        isUpdating={isUpdatingAccount}
        onCancel={handleCancelUpdateField}
        onSave={handleUpdatePersonalInformation}
        value={personalInformation.contactNumber}
      />
    </>
  );
}
