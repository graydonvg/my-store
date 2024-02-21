import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import AccountPageInfo from '../AccountPageInfo';
import AccountPageInfoInput from '../AccountPageInfoInput';
import {
  setFieldToEdit,
  setIsUpdatingAccount,
  setPersonalInformation,
  setPersonalInformationOnChange,
} from '@/lib/redux/slices/accountSlice';
import { ChangeEvent, ReactNode, useEffect } from 'react';
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
      disableSave={value.length === 0 || isUpdating}
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
        firstName: userData?.firstName ?? '',
        lastName: userData?.lastName ?? '',
        contactNumber: userData?.contactNumber ?? '',
      })
    );
  }, [dispatch, userData?.firstName, userData?.lastName, userData?.contactNumber]);

  function handleSetFieldToEdit(field: keyof PersonalInformationType) {
    dispatch(setFieldToEdit(field));
  }

  function handleCancelUpdateField() {
    dispatch(setFieldToEdit(null));
    dispatch(
      setPersonalInformation({
        firstName: userData?.firstName ?? '',
        lastName: userData?.lastName ?? '',
        contactNumber: userData?.contactNumber ?? '',
      })
    );
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    dispatch(setPersonalInformationOnChange({ field: name as keyof PersonalInformationType, value }));
  }

  async function handleUpdatePersonalInformation() {
    const isFirstNameChanged = personalInformation.firstName !== userData?.firstName;
    const isLastNameChanged = personalInformation.lastName !== userData?.lastName;
    const iscontactNumberChanged = personalInformation.contactNumber !== userData?.contactNumber;

    if (!isFirstNameChanged && !isLastNameChanged && !iscontactNumberChanged) return;

    dispatch(setIsUpdatingAccount(true));

    const userInfo = {
      firstName: personalInformation?.firstName,
      lastName: personalInformation?.lastName,
      contactNumber: personalInformation?.contactNumber,
    };

    const { success, message } = await updateUserPersonalInformation(userInfo);

    if (success === true) {
      router.refresh();
      if (isFirstNameChanged) {
        toast.success('Name updated succssfully');
      } else if (isLastNameChanged) {
        toast.success('Surname updated succssfully');
      } else {
        toast.success('Contact number updated succssfully');
      }
    } else {
      toast.error(message);
      dispatch(setIsUpdatingAccount(false));
    }
  }

  useEffect(() => {
    dispatch(setFieldToEdit(null));
    dispatch(setIsUpdatingAccount(false));
  }, [dispatch, userData]);

  return (
    <>
      <UserData
        show={fieldToEdit !== 'firstName'}
        label="Name"
        onClick={() => handleSetFieldToEdit('firstName')}>
        {renderUserInfo(userData?.firstName!)}
      </UserData>
      <UpdateUserData
        show={fieldToEdit === 'firstName'}
        textFieldData={[
          {
            id: 'firstName',
            label: 'Name',
            name: 'firstName',
            type: 'text',
            value: personalInformation.firstName,
            onChange: handleInputChange,
            onKeyDownFunction: handleUpdatePersonalInformation,
          },
        ]}
        isUpdating={isUpdatingAccount}
        onCancel={handleCancelUpdateField}
        onSave={handleUpdatePersonalInformation}
        value={personalInformation.firstName}
      />
      <UserData
        show={fieldToEdit !== 'lastName'}
        label="Surname"
        onClick={() => handleSetFieldToEdit('lastName')}>
        {renderUserInfo(userData?.lastName!)}
      </UserData>
      <UpdateUserData
        show={fieldToEdit === 'lastName'}
        textFieldData={[
          {
            id: 'lastName',
            label: 'Surname',
            name: 'lastName',
            type: 'text',
            value: personalInformation.lastName,
            onChange: handleInputChange,
            onKeyDownFunction: handleUpdatePersonalInformation,
          },
        ]}
        isUpdating={isUpdatingAccount}
        onCancel={handleCancelUpdateField}
        onSave={handleUpdatePersonalInformation}
        value={personalInformation.lastName}
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
