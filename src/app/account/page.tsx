'use client';

import ContainedButton from '@/components/ui/buttons/ContainedButton';
import OutlinedButton from '@/components/ui/buttons/OutlinedButton';
import CustomTextField from '@/components/ui/inputFields/CustomTextField';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppSelector } from '@/lib/redux/hooks';
import { Box, TextField, Typography, useTheme } from '@mui/material';
import { useState } from 'react';

type Props = {};

export default function Account() {
  const [updateSurname, setUpdateSurname] = useState(false);
  const [updateName, setUpdateName] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const focusedColor = mode === 'dark' ? customColorPalette.grey.light : customColorPalette.grey.dark;

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

  function handleUpdatePassword() {
    setUpdatePassword(false);
  }
  function handleUpdateName() {
    setUpdateName(false);
  }
  function handleUpdateSurname() {
    setUpdateSurname(false);
  }

  function renderButtons(onSave?: () => void, onCancel?: () => void) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: { xs: 'unset', sm: '600px' },
        margin: '0 auto',
      }}>
      <Typography
        component="h2"
        fontSize={24}
        fontWeight={600}>
        Account
      </Typography>
      <TextField
        sx={{
          pointerEvents: 'none',
          '& label.Mui-focused': {
            color: focusedColor,
          },
          '& .MuiInputLabel-root': {
            pointerEvents: 'none',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'transparent',
            },
            '&:hover fieldset': {
              borderColor: 'transparent',
            },
            '&.Mui-focused fieldset': {
              borderColor: focusedColor,
            },
          },
        }}
        fullWidth={true}
        id={'email'}
        label={'Email'}
        name={'email'}
        type={'email'}
        value={currentUser?.email}
        // onChange={handleInputChange}
      />
      {!updatePassword ? (
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
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent',
              },
            },
          }}
          fullWidth={true}
          id={'password'}
          label={'Password'}
          name={'password'}
          type={'password'}
          value={123456}
          // onChange={handleInputChange}
          onClick={selectUpdatePassword}
        />
      ) : (
        <>
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
                  borderColor: focusedColor,
                },
              },
            }}
            fullWidth={true}
            id={'current-password'}
            label={'Current Password'}
            name={'current-password'}
            type={'password'}
            value={123456}
            // onChange={handleInputChange}
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
                  borderColor: focusedColor,
                },
              },
            }}
            fullWidth={true}
            id={'new-password'}
            label={'New Password'}
            name={'new-password'}
            type={'password'}
            value={123456}
            // onChange={handleInputChange}
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
                  borderColor: focusedColor,
                },
              },
            }}
            fullWidth={true}
            id={'confirm-password'}
            label={'Confirm Password'}
            name={'confirm-password'}
            type={'password'}
            value={123456}
            // onChange={handleInputChange}
          />
          {renderButtons(handleUpdatePassword, () => setUpdatePassword(false))}
        </>
      )}
      <Typography
        component="h2"
        fontSize={24}
        fontWeight={600}>
        Personal information
      </Typography>
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
              borderColor: focusedColor,
            },
          },
        }}
        fullWidth={true}
        id={'name'}
        label={'Name'}
        name={'name'}
        type={'text'}
        value={currentUser?.first_name}
        onClick={selectUpdateName}
        // onChange={handleInputChange}
      />
      {updateName ? renderButtons(handleUpdateName, () => setUpdateName(false)) : null}
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
              borderColor: focusedColor,
            },
          },
        }}
        fullWidth={true}
        id={'surname'}
        label={'Surname'}
        name={'surname'}
        type={'text'}
        value={currentUser?.last_name}
        onClick={selectUpdateSurname}
        // onChange={handleInputChange}
      />
      {updateSurname ? renderButtons(handleUpdateSurname, () => setUpdateSurname(false)) : null}
    </Box>
  );
}
