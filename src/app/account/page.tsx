'use client';

import AccountInformation from '@/components/ui/AccountInformation';
import ContainedButton from '@/components/ui/buttons/ContainedButton';
import OutlinedButton from '@/components/ui/buttons/OutlinedButton';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setCurrentUser } from '@/lib/redux/user/userSlice';
import { updateUserPassword, updateUserPersonalInformation } from '@/services/users/update-user';
import { Box, Grid, TextField, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { toast } from 'react-toastify';

export default function Account() {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const defaultFormData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    name: currentUser?.first_name!,
    surname: currentUser?.last_name!,
  };
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState(defaultFormData);
  const [fieldToUpdate, setFieldToUpdate] = useState<string | null>(null);
  const customColorPalette = useCustomColorPalette();
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

  function renderTextField({
    id,
    label,
    name,
    type,
    value,
    onKeyDownFunction,
  }: {
    id: string;
    label: string;
    name: string;
    type: string;
    value: string;
    onKeyDownFunction: any;
  }) {
    const mode = theme.palette.mode;
    const focusedColor = mode === 'dark' ? customColorPalette.grey.light : customColorPalette.grey.dark;

    return (
      <TextField
        sx={{
          '& label.Mui-focused': {
            color: focusedColor,
          },
          '& .MuiOutlinedInput-input:hover': {
            cursor: 'pointer',
          },
          '& .MuiOutlinedInput-input:focus ': {
            cursor: 'auto',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              border: `1px solid ${focusedColor}`,
            },
            '&:hover fieldset': {
              border: `1px solid ${focusedColor}`,
            },
            '&.Mui-focused fieldset': {
              border: `1px solid ${focusedColor}`,
            },
          },
        }}
        fullWidth={true}
        id={id}
        label={label}
        name={name}
        type={type}
        value={value}
        onChange={handleInputChange}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onKeyDownFunction();
          }
        }}
      />
    );
  }

  function renderButtons(onSave: () => void) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, paddingBottom: 2 }}>
        <ContainedButton
          label="save"
          fullWidth={false}
          backgroundColor="blue"
          style={{ minWidth: '96px' }}
          onClick={onSave}
        />
        <OutlinedButton
          label="cancel"
          fullWidth={false}
          style={{ minWidth: '96px' }}
          onClick={handleCancelUpdateField}
        />
      </Box>
    );
  }

  return (
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
            <AccountInformation
              label="Email"
              canEdit={false}
              onClick={null}>
              <Typography
                component="span"
                fontSize={16}>
                {currentUser?.email}
              </Typography>
            </AccountInformation>
            {fieldToUpdate !== 'password' ? (
              <AccountInformation
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
              </AccountInformation>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 1.1 }}>
                {renderTextField({
                  id: 'current-password',
                  label: 'Current Password',
                  name: 'currentPassword',
                  type: 'password',
                  value: formData.currentPassword,
                  onKeyDownFunction: handleUpdatePassword,
                })}
                {renderTextField({
                  id: 'new-password',
                  label: 'New Password',
                  name: 'newPassword',
                  type: 'password',
                  value: formData.newPassword,
                  onKeyDownFunction: handleUpdatePassword,
                })}
                {renderTextField({
                  id: 'confirm-password',
                  label: 'Confirm Password',
                  name: 'confirmPassword',
                  type: 'password',
                  value: formData.confirmPassword,
                  onKeyDownFunction: handleUpdatePassword,
                })}
                {renderButtons(handleUpdatePassword)}
              </Box>
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
              <AccountInformation
                label="Name"
                canEdit={true}
                onClick={() => handleSetFieldToUpdate('name')}>
                <Typography
                  component="span"
                  fontSize={16}>
                  {currentUser?.first_name}
                </Typography>
              </AccountInformation>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 1.1 }}>
                {renderTextField({
                  id: 'name',
                  label: 'Name',
                  name: 'name',
                  type: 'text',
                  value: formData.name,
                  onKeyDownFunction: handleUpdatePersonalInformation,
                })}
                {renderButtons(handleUpdatePersonalInformation)}
              </Box>
            )}
            {fieldToUpdate !== 'surname' ? (
              <AccountInformation
                label="Surname"
                canEdit={true}
                onClick={() => handleSetFieldToUpdate('surname')}>
                <Typography
                  component="span"
                  fontSize={16}>
                  {currentUser?.last_name}
                </Typography>
              </AccountInformation>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 1.1 }}>
                {renderTextField({
                  id: 'surname',
                  label: 'Surname',
                  name: 'surname',
                  type: 'text',
                  value: formData.surname,
                  onKeyDownFunction: handleUpdatePersonalInformation,
                })}
                {renderButtons(handleUpdatePersonalInformation)}
              </Box>
            )}
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}>
        {/* <Box>stuff</Box> */}
      </Grid>
    </Grid>
  );
}
