'use client';

import AccountInfoInput from '@/components/ui/AccountInfoInput';
import AccountInfo from '@/components/ui/AccountInfo';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setCurrentUser } from '@/lib/redux/user/userSlice';
import { updateUserPassword, updateUserPersonalInformation } from '@/services/users/update-user';
import { Box, Divider, Grid, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { toast } from 'react-toastify';

export default function Account() {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const defaultFormData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    name: currentUser?.first_name ?? '',
    surname: currentUser?.last_name ?? '',
    contactNumber: currentUser?.contact_number ?? '',
  };
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState(defaultFormData);
  const [fieldToUpdate, setFieldToUpdate] = useState<string | null>(null);
  const theme = useTheme();
  const mode = theme.palette.mode;

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  function handleSetFieldToUpdate(field: string) {
    setFormData(defaultFormData);
    setFieldToUpdate(field);
  }

  function handleCancelUpdateField() {
    setFormData(defaultFormData);
    setFieldToUpdate(null);
  }

  async function handleUpdatePassword() {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      return toast.error('Please complete all fields.');
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error('Passwords do not match.');
    }

    try {
      const { success, message } = await updateUserPassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      if (success === true) {
        toast.success(message);
        setFieldToUpdate(null);
        setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error('Failed to update password. Please try again later.');
    }
  }

  async function handleUpdatePersonalInformation() {
    try {
      const { success, message } = await updateUserPersonalInformation({
        first_name: formData.name,
        last_name: formData.surname,
        contact_number: formData.contactNumber,
      });

      if (success === true) {
        toast.success(message);
        setFieldToUpdate(null);
        dispatch(setCurrentUser({ ...currentUser!, first_name: formData.name, last_name: formData.surname }));
        router.refresh();
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error('Failed to update personal information. Please try again later.');
    }
  }

  return (
    <Box>
      <Box
        component="header"
        sx={{ paddingBottom: 2 }}>
        <Divider />
        <Typography
          component="h1"
          fontSize={{ xs: 26, sm: 30 }}
          fontWeight={500}
          sx={{ paddingY: 1, textAlign: 'center' }}>
          {currentUser?.first_name} {currentUser?.last_name}
        </Typography>
        <Divider />
      </Box>
      <Grid container>
        <Grid
          item
          xs={12}
          md={6}>
          <Box
            sx={{
              maxWidth: { xs: 'unset', md: '75%' },
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography
                component="h2"
                fontSize={24}
                fontWeight={600}>
                Account
              </Typography>
              <AccountInfo
                label="Email"
                canEdit={false}
                onClick={null}>
                <Typography
                  component="span"
                  fontSize={16}>
                  {currentUser?.email}
                </Typography>
              </AccountInfo>
              {fieldToUpdate !== 'password' ? (
                <AccountInfo
                  label="Password"
                  canEdit={true}
                  onClick={() => handleSetFieldToUpdate('password')}>
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
                </AccountInfo>
              ) : (
                <AccountInfoInput
                  textFieldData={[
                    {
                      id: 'current-password',
                      label: 'Current Password',
                      name: 'currentPassword',
                      type: 'password',
                      value: formData.currentPassword,
                      onChange: handleInputChange,
                      onKeyDownFunction: handleUpdatePassword,
                    },
                    {
                      id: 'new-password',
                      label: 'New Password',
                      name: 'newPassword',
                      type: 'password',
                      value: formData.newPassword,
                      onChange: handleInputChange,
                      onKeyDownFunction: handleUpdatePassword,
                    },
                    {
                      id: 'confirm-password',
                      label: 'Confirm Password',
                      name: 'confirmPassword',
                      type: 'password',
                      value: formData.confirmPassword,
                      onChange: handleInputChange,
                      onKeyDownFunction: handleUpdatePassword,
                    },
                  ]}
                  onSave={handleUpdatePassword}
                  onCancel={handleCancelUpdateField}
                  disableSave={
                    formData.currentPassword.length === 0 ||
                    formData.newPassword.length === 0 ||
                    formData.confirmPassword.length === 0
                  }
                />
              )}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography
                component="h2"
                fontSize={24}
                fontWeight={600}>
                Personal information
              </Typography>
              {fieldToUpdate !== 'name' ? (
                <AccountInfo
                  label="Name"
                  canEdit={true}
                  onClick={() => handleSetFieldToUpdate('name')}>
                  <Typography
                    component="span"
                    fontSize={16}>
                    {currentUser?.first_name}
                  </Typography>
                </AccountInfo>
              ) : (
                <AccountInfoInput
                  textFieldData={[
                    {
                      id: 'name',
                      label: 'Name',
                      name: 'name',
                      type: 'text',
                      value: formData.name,
                      onChange: handleInputChange,
                      onKeyDownFunction: handleUpdatePersonalInformation,
                    },
                  ]}
                  onSave={handleUpdatePersonalInformation}
                  onCancel={handleCancelUpdateField}
                  disableSave={formData.name.length === 0}
                />
              )}
              {fieldToUpdate !== 'surname' ? (
                <AccountInfo
                  label="Surname"
                  canEdit={true}
                  onClick={() => handleSetFieldToUpdate('surname')}>
                  <Typography
                    component="span"
                    fontSize={16}>
                    {currentUser?.last_name}
                  </Typography>
                </AccountInfo>
              ) : (
                <AccountInfoInput
                  textFieldData={[
                    {
                      id: 'surname',
                      label: 'Surname',
                      name: 'surname',
                      type: 'text',
                      value: formData.surname,
                      onChange: handleInputChange,
                      onKeyDownFunction: handleUpdatePersonalInformation,
                    },
                  ]}
                  onSave={handleUpdatePersonalInformation}
                  onCancel={handleCancelUpdateField}
                  disableSave={formData.surname.length === 0}
                />
              )}
              {fieldToUpdate !== 'contactNumber' ? (
                <AccountInfo
                  label="Contact number"
                  canEdit={true}
                  onClick={() => handleSetFieldToUpdate('contactNumber')}>
                  <Typography
                    component="span"
                    fontSize={16}>
                    {currentUser?.contact_number}
                  </Typography>
                </AccountInfo>
              ) : (
                <AccountInfoInput
                  textFieldData={[
                    {
                      id: 'contact-number',
                      label: 'Contact number',
                      name: 'contactNumber',
                      type: 'text',
                      value: formData.contactNumber,
                      onChange: handleInputChange,
                      onKeyDownFunction: handleUpdatePersonalInformation,
                    },
                  ]}
                  onSave={handleUpdatePersonalInformation}
                  onCancel={handleCancelUpdateField}
                  disableSave={formData.contactNumber.length === 0}
                />
              )}
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography
              component="h2"
              fontSize={24}
              fontWeight={600}>
              Addresses
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
