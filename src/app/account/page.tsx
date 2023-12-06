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
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Account() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const defaultFormData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    name: '',
    surname: '',
  };
  const [formData, setFormData] = useState(defaultFormData);
  const [updateSurname, setUpdateSurname] = useState(false);
  const [updateName, setUpdateName] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const focusedColor = mode === 'dark' ? customColorPalette.grey.light : customColorPalette.grey.dark;

  useEffect(() => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      name: currentUser?.first_name!,
      surname: currentUser?.last_name!,
    });
  }, [currentUser]);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function selectUpdatePassword() {
    setUpdateSurname(false);
    setUpdateName(false);
    setUpdatePassword(true);
  }

  function selectUpdateName() {
    setUpdateSurname(false);
    setUpdatePassword(false);
    setUpdateName(true);
  }

  function selectUpdateSurname() {
    setUpdateName(false);
    setUpdatePassword(false);
    setUpdateSurname(true);
  }

  function handleCancelUpdatePassword() {
    setUpdatePassword(false);
    setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
  }

  function handleCancelUpdateName() {
    setUpdateName(false);
    setFormData({ ...formData, name: currentUser?.first_name! });
  }

  function handleCancelUpdateSurname() {
    setUpdateSurname(false);
    setFormData({ ...formData, surname: currentUser?.last_name! });
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
        setUpdatePassword(false);
        setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error('Failed to update password. Please try again later.');
    }
  }

  async function handleUpdateName() {
    try {
      const { success, message } = await updateUserPersonalInformation({
        first_name: formData.name,
        last_name: formData.surname,
      });

      if (success === true) {
        toast.success(message);
        setUpdateName(false);
        dispatch(setCurrentUser({ ...currentUser!, first_name: formData.name }));
        router.refresh();
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error('Failed to update personal information. Please try again later.');
    }
  }

  async function handleUpdateSurname() {
    try {
      const { success, message } = await updateUserPersonalInformation({
        first_name: formData.name,
        last_name: formData.surname,
      });

      if (success === true) {
        toast.success(message);
        setUpdateSurname(false);
        dispatch(setCurrentUser({ ...currentUser!, last_name: formData.surname }));
        router.refresh();
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error('Failed to update personal information. Please try again later.');
    }
  }

  function renderButtons(onSave: () => void, onCancel: () => void) {
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
          onClick={onCancel}
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
            {!updatePassword ? (
              <AccountInformation
                label="Password"
                canEdit={true}
                onClick={selectUpdatePassword}>
                <Typography
                  component="div"
                  fontSize={3.3}
                  sx={{ paddingTop: 1 }}>
                  {Array.from(Array(16)).map((_, index) => (
                    <Box
                      component="span"
                      key={index}
                      sx={{ paddingRight: 0.12 }}>
                      ⚫
                    </Box>
                  ))}
                </Typography>
              </AccountInformation>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 1.1 }}>
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
                        borderColor: updatePassword ? focusedColor : 'transparent',
                      },
                      '&:hover fieldset': {
                        borderColor: updatePassword ? focusedColor : 'transparent',
                      },
                      '&.Mui-focused fieldset': {
                        border: `1px solid ${focusedColor}`,
                      },
                    },
                  }}
                  fullWidth={true}
                  id={'current-password'}
                  label={'Current Password'}
                  name={'currentPassword'}
                  type={'password'}
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleUpdatePassword();
                    }
                  }}
                />
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
                        borderColor: updatePassword ? focusedColor : 'transparent',
                      },
                      '&:hover fieldset': {
                        borderColor: updatePassword ? focusedColor : 'transparent',
                      },
                      '&.Mui-focused fieldset': {
                        border: `1px solid ${focusedColor}`,
                      },
                    },
                  }}
                  fullWidth={true}
                  id={'new-password'}
                  label={'New Password'}
                  name={'newPassword'}
                  type={'password'}
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleUpdatePassword();
                    }
                  }}
                />
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
                        borderColor: updatePassword ? focusedColor : 'transparent',
                      },
                      '&:hover fieldset': {
                        borderColor: updatePassword ? focusedColor : 'transparent',
                      },
                      '&.Mui-focused fieldset': {
                        border: `1px solid ${focusedColor}`,
                      },
                    },
                  }}
                  fullWidth={true}
                  id={'confirm-password'}
                  label={'Confirm Password'}
                  name={'confirmPassword'}
                  type={'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleUpdatePassword();
                    }
                  }}
                />
                {renderButtons(handleUpdatePassword, handleCancelUpdatePassword)}
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
            {!updateName ? (
              <AccountInformation
                label="Name"
                canEdit={true}
                onClick={selectUpdateName}>
                <Typography
                  component="span"
                  fontSize={16}>
                  {currentUser?.first_name}
                </Typography>
              </AccountInformation>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 1.1 }}>
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
                        borderColor: updateName ? focusedColor : 'transparent',
                      },
                      '&:hover fieldset': {
                        borderColor: updateName ? focusedColor : 'transparent',
                      },
                      '&.Mui-focused fieldset': {
                        border: `1px solid ${focusedColor}`,
                      },
                    },
                  }}
                  fullWidth={true}
                  id={'name'}
                  label={'Name'}
                  name={'name'}
                  type={'text'}
                  value={formData.name}
                  onClick={selectUpdateName}
                  onChange={handleInputChange}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleUpdateName();
                    }
                  }}
                />
                {renderButtons(handleUpdateName, handleCancelUpdateName)}
              </Box>
            )}
            {!updateSurname ? (
              <AccountInformation
                label="Surname"
                canEdit={true}
                onClick={selectUpdateSurname}>
                <Typography
                  component="span"
                  fontSize={16}>
                  {currentUser?.last_name}
                </Typography>
              </AccountInformation>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 1.1 }}>
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
                        borderColor: updateSurname ? focusedColor : 'transparent',
                      },
                      '&:hover fieldset': {
                        borderColor: updateSurname ? focusedColor : 'transparent',
                      },
                      '&.Mui-focused fieldset': {
                        border: `1px solid ${focusedColor}`,
                      },
                    },
                  }}
                  fullWidth={true}
                  id={'surname'}
                  label={'Surname'}
                  name={'surname'}
                  type={'text'}
                  value={formData.surname}
                  onClick={selectUpdateSurname}
                  onChange={handleInputChange}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleUpdateSurname();
                    }
                  }}
                />
                {renderButtons(handleUpdateSurname, handleCancelUpdateSurname)}
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
