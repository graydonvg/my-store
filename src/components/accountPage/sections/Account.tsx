'use client';

import { Box, Typography, useTheme } from '@mui/material';
import AccountPageInfo from '../AccountPageInfo';
import AccountPageSectionContainer from '../AccountPageSectionContainer';
import AccountPageInfoInput from '../AccountPageInfoInput';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { ChangeEvent, ReactNode } from 'react';
import {
  clearPasswordFields,
  setAccountDataOnChange,
  setFieldToEdit,
  setIsUpdatingAccount,
} from '@/lib/redux/account/accountSlice';
import { toast } from 'react-toastify';
import { updateUserPassword } from '@/services/users/update-user';
import { AccountType } from '@/types';
import { useRouter } from 'next/navigation';

type Props = {
  renderUserInfo: (value: string) => ReactNode;
};

export default function Account({ renderUserInfo }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isOAuthSignIn, currentUser } = useAppSelector((state) => state.user);
  const { accountData, fieldToEdit, isUpdatingAccount } = useAppSelector((state) => state.account);
  const theme = useTheme();
  const mode = theme.palette.mode;

  function handleSetFieldToEdit(field: string) {
    dispatch(setFieldToEdit(field));
  }

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
    try {
      const { success, message } = await updateUserPassword({
        currentPassword: accountData.currentPassword,
        newPassword: accountData.newPassword,
        confirmPassword: accountData.confirmPassword,
      });
      if (success === true) {
        router.refresh();
        toast.success(message);
        dispatch(setFieldToEdit(null));
        dispatch(clearPasswordFields());
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error('Failed to update password. Please try again later.');
    } finally {
      dispatch(setIsUpdatingAccount(false));
    }
  }

  return (
    <AccountPageSectionContainer title="Account">
      <AccountPageInfo
        label="Email"
        canEdit={false}
        onClick={null}>
        {renderUserInfo(currentUser?.email!)}
      </AccountPageInfo>
      {!isOAuthSignIn ? (
        fieldToEdit !== 'password' ? (
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
        ) : (
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
              accountData.confirmPassword.length === 0
            }
          />
        )
      ) : null}
    </AccountPageSectionContainer>
  );
}
