'use client';

import { useState, ChangeEvent, FormEvent, ReactNode } from 'react';
import { Box, Grid } from '@mui/material';
import FormHeading from './FormHeading';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeDialog, setIsDialogLoading } from '@/lib/redux/slices/dialogSlice';
import ContainedButton from '../ui/buttons/ContainedButton';
import CustomTextField from '../ui/inputFields/CustomTextField';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import signUpNewUser from '@/services/auth/sign-up';

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
};

type Props = {
  children: ReactNode;
};

export default function SignUpForm({ children }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isSignUpDialogOpen = useAppSelector((state) => state.dialog.signUpDialog);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

    // User role defaults to customer db side
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
        alignItems: 'center',
        gap: 3,
      }}>
      <FormHeading text="Sign up" />
      <Box
        component="form"
        onSubmit={handleSignUp}>
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
        </Grid>
        <ContainedButton
          label={!isSignUpDialogOpen && isLoading ? '' : 'sign up'}
          disabled={isLoading}
          isLoading={!isSignUpDialogOpen && isLoading}
          type="submit"
          styles={{
            marginTop: 3,
            marginBottom: 3,
          }}
          fullWidth
          backgroundColor="primary"
        />
        {children}
      </Box>
    </Box>
  );
}
