'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import AccountPageInfo from '../AccountPageInfo';
import AccountPageInfoInput from '../AccountPageInfoInput';
import AccountPageSectionContainer from '../AccountPageSectionContainer';
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
import { PersonalInformationType } from '@/types';

type Props = {
  renderUserInfo: (value: string) => ReactNode;
};

export default function PersonalInformation({ renderUserInfo }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const { personalInformation, fieldToEdit, isUpdatingAccount } = useAppSelector((state) => state.account);

  useEffect(() => {
    dispatch(
      setPersonalInformation({
        name: currentUser?.first_name ?? '',
        surname: currentUser?.last_name ?? '',
        contactNumber: currentUser?.contact_number ?? '',
      })
    );
  }, [dispatch, currentUser?.first_name, currentUser?.last_name, currentUser?.contact_number]);

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
      personalInformation.name === currentUser?.first_name &&
      personalInformation.surname === currentUser.last_name &&
      personalInformation.contactNumber === currentUser.contact_number
    )
      return;
    dispatch(setIsUpdatingAccount(true));
    try {
      const { success, message } = await updateUserPersonalInformation({
        first_name: personalInformation.name,
        last_name: personalInformation.surname,
        contact_number: personalInformation.contactNumber,
      });
      if (success === true) {
        dispatch(
          setCurrentUser({
            ...currentUser!,
            first_name: personalInformation.name,
            last_name: personalInformation.surname,
            contact_number: personalInformation.contactNumber,
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
      {fieldToEdit !== 'name' ? (
        <AccountPageInfo
          label="Name"
          canEdit={true}
          onClick={() => handleSetFieldToEdit('name')}>
          {renderUserInfo(currentUser?.first_name!)}
        </AccountPageInfo>
      ) : (
        <AccountPageInfoInput
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
          onSave={handleUpdatePersonalInformation}
          onCancel={handleCancelUpdateField}
          disableSave={personalInformation.name.length === 0}
        />
      )}
      {fieldToEdit !== 'surname' ? (
        <AccountPageInfo
          label="Surname"
          canEdit={true}
          onClick={() => handleSetFieldToEdit('surname')}>
          {renderUserInfo(currentUser?.last_name!)}
        </AccountPageInfo>
      ) : (
        <AccountPageInfoInput
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
          onSave={handleUpdatePersonalInformation}
          onCancel={handleCancelUpdateField}
          disableSave={personalInformation.surname.length === 0}
        />
      )}
      {fieldToEdit !== 'contactNumber' ? (
        <AccountPageInfo
          label="Contact number"
          canEdit={true}
          onClick={() => handleSetFieldToEdit('contactNumber')}>
          {renderUserInfo(currentUser?.contact_number!)}
        </AccountPageInfo>
      ) : (
        <AccountPageInfoInput
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
          onSave={handleUpdatePersonalInformation}
          onCancel={handleCancelUpdateField}
          disableSave={personalInformation.contactNumber.length === 0}
        />
      )}
    </>
  );
}
