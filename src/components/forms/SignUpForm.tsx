'use client';

import { useState, ChangeEvent, FormEvent, ReactNode } from 'react';
import { Box, Grid, useTheme } from '@mui/material';
import FormHeader from './FormHeader';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeDialog, setIsDialogLoading } from '@/lib/redux/features/dialog/dialogSlice';
import ContainedButton from '../ui/buttons/simple/ContainedButton';
import CustomTextField from '../ui/inputFields/CustomTextField';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import signUpNewUser from '@/services/auth/sign-up';
import { Call, Email, Lock, Person } from '@mui/icons-material';
import { selectIsSignInDialogOpen } from '@/lib/redux/features/dialog/dialogSelectors';

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
  { label: 'Email Address', name: 'email', type: 'text', autoComplete: 'email', required: true, icon: <Email /> },
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
};

type Props = {
  headerComponent: 'h1' | 'h2';
  children: ReactNode;
};

export default function SignUpForm({ headerComponent, children }: Props) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isSignUpDialogOpen = useAppSelector(selectIsSignInDialogOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    if (isSignUpDialogOpen) {
      dispatch(setIsDialogLoading(true));
    }

    const { email, password, firstName, lastName, contactNumber } = formData;

    const { success, message } = await signUpNewUser({
      email,
      password,
      firstName,
      lastName,
      contactNumber,
    });

    if (success === true) {
      dispatch(closeDialog());
      setFormData(defaultFormData);
      router.refresh();
    } else {
      toast.error(message);
    }

    setIsLoading(false);

    if (isSignUpDialogOpen) {
      dispatch(setIsDialogLoading(false));
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 3,
        paddingBottom: 3,
      }}>
      <FormHeader
        headerComponent={headerComponent}
        text="Sign up"
      />
      <Box
        component="form"
        onSubmit={handleSignUp}
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
                backgroundColor={theme.palette.custom.dialog.background.accent}
                icon={field.icon}
                hasValue={formData[field.name as keyof typeof formData].length > 0}
              />
            </Grid>
          ))}
        </Grid>
        <ContainedButton
          label={!isSignUpDialogOpen && isLoading ? '' : 'sign up'}
          disabled={isSignUpDialogOpen && isLoading}
          isLoading={!isSignUpDialogOpen && isLoading}
          type="submit"
          sxStyles={{
            marginTop: 3,
            marginBottom: 3,
          }}
          fullWidth
          color="primary"
        />
        {children}
      </Box>
    </Box>
  );
}
