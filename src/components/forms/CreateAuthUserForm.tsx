'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Box, Grid } from '@mui/material';
import FormHeading from './FormHeading';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeDialog, setIsDialogLoading } from '@/lib/redux/slices/dialogSlice';
import ContainedButton from '../ui/buttons/ContainedButton';
import CustomTextField from '../ui/inputFields/CustomTextField';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import SelectField from '../ui/inputFields/SelectField';
import { USER_ROLE_OPTIONS } from '@/config';
import { createAuthUser } from '@/services/users/create';
import { UserRole } from '@/types';

const formFields = [
  { label: 'First Name', name: 'firstName', type: 'text', autoComplete: 'given-name', required: false },
  { label: 'Last Name', name: 'lastName', type: 'text', autoComplete: 'family-name', required: false },
  { label: 'Contact number', name: 'contactNumber', type: 'tel', required: false },
  { label: 'Email Address', name: 'email', type: 'text', autoComplete: 'email', required: true },
  { label: 'Password', name: 'password', type: 'password', autoComplete: 'new-password', required: true },
  {
    label: 'Confirm Password',
    name: 'confirmPassword',
    type: 'password',
    autoComplete: 'new-password',
    required: true,
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
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isDialogLoading = useAppSelector((state) => state.dialog.isDialogLoading);
  const authLevel = useAppSelector((state) => state.user.data?.authLevel);
  const [formData, setFormData] = useState(defaultFormData);
  let restricedUserRoleOptions = [...USER_ROLE_OPTIONS];

  if (authLevel && authLevel < 2) {
    restricedUserRoleOptions = USER_ROLE_OPTIONS.filter((role) => role !== 'manager');
  }

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

    const { success, message } = await createAuthUser({
      email,
      password,
      firstName,
      lastName,
      contactNumber,
      role: role as UserRole,
    });

    if (success) {
      toast.success(message);
      dispatch(closeDialog());
      setFormData(defaultFormData);
      router.refresh();
    } else {
      toast.error(message);
    }

    dispatch(setIsDialogLoading(false));
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
      }}>
      <FormHeading text="Create a new user" />
      <Box
        component="form"
        onSubmit={handleCreateAuthUser}>
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
              />
            </Grid>
          ))}
          <Grid
            item
            xs={12}>
            <SelectField
              label="Role"
              name="role"
              options={restricedUserRoleOptions}
              fullWidth
              defaultValue={defaultFormData.role}
              required
              onChange={handleInputChange}
            />
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
          color="primary"
        />
      </Box>
    </Box>
  );
}
