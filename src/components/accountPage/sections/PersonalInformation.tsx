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
import { setUserData } from '@/lib/redux/user/userSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { AccountTextFieldDataType, PersonalInformationType } from '@/types';
import { updateUserPersonalInformation } from '@/services/users/update';

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
  textFieldData: AccountTextFieldDataType[];
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
  const userData = useAppSelector((state) => state.user.userData);
  const { personalInformation, fieldToEdit, isUpdatingAccount } = useAppSelector((state) => state.account);

  useEffect(() => {
    dispatch(
      setPersonalInformation({
        name: userData?.firstName ?? '',
        surname: userData?.lastName ?? '',
        contactNumber: userData?.contactNumber ?? '',
      })
    );
  }, [dispatch, userData?.firstName, userData?.lastName, userData?.contactNumber]);

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
      personalInformation.name === userData?.firstName &&
      personalInformation.surname === userData.lastName &&
      personalInformation.contactNumber === userData.contactNumber
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
          setUserData({
            ...userData!,
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
        {renderUserInfo(userData?.firstName!)}
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
        {renderUserInfo(userData?.lastName!)}
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
        {renderUserInfo(userData?.contactNumber!)}
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
