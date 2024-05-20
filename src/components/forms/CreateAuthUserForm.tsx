'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Box, FormControl, Grid, useTheme } from '@mui/material';
import FormHeader from './FormHeader';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeDialog, setIsDialogLoading } from '@/lib/redux/features/dialog/dialogSlice';
import ContainedButton from '../ui/buttons/simple/ContainedButton';
import CustomTextField from '../ui/inputFields/CustomTextField';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Person, Call, Email, Lock, AdminPanelSettings } from '@mui/icons-material';
import { USER_ROLE_OPTIONS } from '@/data';
import SelectField from '../ui/inputFields/SelectField';
import { UserRole } from '@/types';
import { createNewUserAdmin } from '@/services/admin/add';

const formFields = [
  {
    label: 'First Name',
    name: 'firstName',
    type: 'text',
    autoComplete: 'given-name',
    required: false,
    icon: <Person />,
  },
  {
    label: 'Last Name',
    name: 'lastName',
    type: 'text',
    autoComplete: 'family-name',
    required: false,
    icon: <Person />,
  },
  { label: 'Contact number', name: 'contactNumber', type: 'tel', required: false, icon: <Call /> },
  {
    label: 'Email Address',
    name: 'email',
    type: 'text',
    autoComplete: 'email',
    required: true,
    icon: <Email />,
  },
  {
    label: 'Password',
    name: 'password',
    type: 'password',
    autoComplete: 'new-password',
    required: true,
    icon: <Lock />,
  },
  {
    label: 'Confirm Password',
    name: 'confirmPassword',
    type: 'password',
    autoComplete: 'new-password',
    required: true,
    icon: <Lock />,
  },
];

const defaultFormData = {
  firstName: '',
  lastName: '',
  email: '',
  contactNumber: '',
  password: '',
  confirmPassword: '',
  role: '',
};

export default function CreateAuthUserForm() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isDialogLoading = useAppSelector((state) => state.dialog.isDialogLoading);
  const [formData, setFormData] = useState(defaultFormData);
  const userData = useAppSelector((state) => state.user.data);
  const restricedUserRoleOptions = USER_ROLE_OPTIONS.filter((role) => {
    if (userData?.role === 'admin') {
      return role === 'none';
    } else if (userData?.role === 'manager') {
      return role === 'none' || role === 'admin';
    } else {
      return role;
    }
  });

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  async function handleCreateAuthUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    dispatch(setIsDialogLoading(true));

    const { email, password, firstName, lastName, contactNumber, role } = formData;

    const { success, message } = await createNewUserAdmin({
      email,
      password,
      firstName,
      lastName,
      contactNumber,
      role: role === 'none' ? null : (role as UserRole),
    });

    if (success) {
      toast.success(message);
      dispatch(closeDialog());
      setFormData(defaultFormData);
    } else {
      toast.error(message);
    }

    router.refresh();
    dispatch(setIsDialogLoading(false));
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 2,
      }}>
      <FormHeader
        text="Create a new user"
        headerComponent="h2"
      />
      <Box
        component="form"
        onSubmit={handleCreateAuthUser}
        sx={{ paddingX: 2 }}>
        <Grid
          container
          spacing={2}>
          {formFields.map((field) => (
            <Grid
              item
              xs={12}
              sm={field.name === 'firstName' || field.name === 'lastName' ? 6 : false}
              key={field.name}>
              <CustomTextField
                label={field.label}
                name={field.name}
                type={field.type}
                value={formData[field.name as keyof typeof formData]}
                autoComplete={field.autoComplete}
                autoFocus={field.name === 'firstName'}
                required={field.required}
                fullWidth={true}
                onChange={handleInputChange}
                icon={field.icon}
                hasValue={formData[field.name as keyof typeof formData].length > 0}
                backgroundColor={theme.palette.custom.dialog.background.accent}
              />
            </Grid>
          ))}
          <Grid
            item
            xs={12}>
            <FormControl fullWidth>
              <SelectField
                label="Role"
                name="role"
                options={restricedUserRoleOptions}
                value={formData.role}
                fullWidth
                required
                onChange={handleInputChange}
                icon={<AdminPanelSettings />}
                hasValue={formData.role.length > 0}
                backgroundColor={theme.palette.custom.dialog.background.accent}
              />
            </FormControl>
          </Grid>
        </Grid>
        <ContainedButton
          label="create user"
          disabled={isDialogLoading}
          type="submit"
          sxStyles={{
            marginTop: 3,
            marginBottom: 3,
          }}
          fullWidth
          color="secondary"
        />
      </Box>
    </Box>
  );
}
