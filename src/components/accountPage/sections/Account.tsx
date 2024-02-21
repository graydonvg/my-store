'use client';

import { Box, Typography, useTheme } from '@mui/material';
import AccountPageInfo from '../AccountPageInfo';
import AccountPageInfoInput from '../AccountPageInfoInput';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { ChangeEvent, ReactNode } from 'react';
import {
  clearPasswordFields,
  setAccountDataOnChange,
  setFieldToEdit,
  setIsUpdatingAccount,
} from '@/lib/redux/slices/accountSlice';
import { toast } from 'react-toastify';
import { AccountType } from '@/types';
import { updateUserPassword } from '@/services/users/update';

type PasswordPlaceholderProps = {
  show: boolean;
};

function PasswordMask({ show }: PasswordPlaceholderProps) {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;

  if (!show) return null;

  function handleSetFieldToEdit(field: string) {
    dispatch(setFieldToEdit(field));
  }

  return (
    <AccountPageInfo
      label="Password"
      canEdit={true}
      onClick={() => handleSetFieldToEdit('password')}>
      <Typography
        component="div"
        fontSize={3.3}
        sx={{ paddingTop: 1 }}>
        {Array.from(Array(16)).map((_, index) => (
          <Box
            component="span"
            key={index}
            sx={{ paddingRight: 0.12 }}>
            {mode === 'dark' ? '⚪' : '⚫'}
          </Box>
        ))}
      </Typography>
    </AccountPageInfo>
  );
}

type UpdatePasswordProps = {
  show: boolean;
};

function UpdatePassword({ show }: UpdatePasswordProps) {
  const dispatch = useAppDispatch();
  const { accountData, isUpdatingAccount } = useAppSelector((state) => state.account);

  if (!show) return null;

  function handleCancelUpdateField() {
    dispatch(setFieldToEdit(null));
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    dispatch(setAccountDataOnChange({ field: name as keyof AccountType, value }));
  }

  async function handleUpdatePassword() {
    if (!accountData.currentPassword || !accountData.newPassword || !accountData.confirmPassword) {
      return toast.error('Please complete all fields.');
    }

    if (accountData.newPassword !== accountData.confirmPassword) {
      return toast.error('Passwords do not match.');
    }

    dispatch(setIsUpdatingAccount(true));

    const { success, message } = await updateUserPassword({
      currentPassword: accountData.currentPassword,
      newPassword: accountData.newPassword,
      confirmPassword: accountData.confirmPassword,
    });

    if (success === false) {
      toast.error(message);
    } else {
      toast.success(message);
      dispatch(setFieldToEdit(null));
      dispatch(clearPasswordFields());
    }

    dispatch(setIsUpdatingAccount(false));
  }

  return (
    <AccountPageInfoInput
      textFieldData={[
        {
          id: 'current-password',
          label: 'Current Password',
          name: 'currentPassword',
          type: 'password',
          value: accountData.currentPassword,
          onChange: handleInputChange,
          onKeyDownFunction: handleUpdatePassword,
        },
        {
          id: 'new-password',
          label: 'New Password',
          name: 'newPassword',
          type: 'password',
          value: accountData.newPassword,
          onChange: handleInputChange,
          onKeyDownFunction: handleUpdatePassword,
        },
        {
          id: 'confirm-password',
          label: 'Confirm Password',
          name: 'confirmPassword',
          type: 'password',
          value: accountData.confirmPassword,
          onChange: handleInputChange,
          onKeyDownFunction: handleUpdatePassword,
        },
      ]}
      isUpdating={isUpdatingAccount}
      onSave={handleUpdatePassword}
      onCancel={handleCancelUpdateField}
      disableSave={
        accountData.currentPassword.length === 0 ||
        accountData.newPassword.length === 0 ||
        accountData.confirmPassword.length === 0 ||
        isUpdatingAccount
      }
    />
  );
}

type AccountProps = {
  renderUserInfo: (value: string) => ReactNode;
};

export default function Account({ renderUserInfo }: AccountProps) {
  const { isOAuthSignIn, userData } = useAppSelector((state) => state.user);
  const { fieldToEdit } = useAppSelector((state) => state.account);

  return (
    <>
      <AccountPageInfo
        label="Email"
        canEdit={false}
        onClick={null}>
        {renderUserInfo(userData?.email!)}
      </AccountPageInfo>
      <PasswordMask show={!isOAuthSignIn && fieldToEdit !== 'password'} />
      <UpdatePassword show={!isOAuthSignIn && fieldToEdit === 'password'} />
    </>
  );
}
