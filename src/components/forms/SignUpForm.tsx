'use client';

import { useState, ChangeEvent, FormEvent, ReactNode } from 'react';
import { Box, Grid } from '@mui/material';
import FormHeading from './FormHeading';
import { useAppDispatch } from '@/lib/redux/hooks';
import { openDialog, setIsDialogLoading } from '@/lib/redux/slices/dialogSlice';
import ContainedButton from '../ui/buttons/ContainedButton';
import CustomTextField from '../ui/inputFields/CustomTextField';
import { toast } from 'react-toastify';
import { usePathname, useRouter } from 'next/navigation';
import signUpNewUser from '@/services/auth/sign-up';
import { updateUserPersonalInformation } from '@/services/users/update';

const formFields = [
  { label: 'First Name', name: 'firstName', autoComplete: 'given-name' },
  { label: 'Last Name', name: 'lastName', autoComplete: 'family-name' },
  { label: 'Email Address', name: 'email', autoComplete: 'email' },
  { label: 'Password', name: 'password', type: 'password', autoComplete: 'new-password' },
  { label: 'Confirm Password', name: 'confirmPassword', type: 'password', autoComplete: 'new-password' },
];

const defaultFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

type Props = {
  children: ReactNode;
};

export default function SignUpForm({ children }: Props) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState(defaultFormData);
  const isWelcomePath = pathname.includes('/welcome');

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
      toast.error('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    !isWelcomePath ? dispatch(setIsDialogLoading(true)) : null;

    const { email, password, firstName, lastName } = formData;

    const { success: signUpSuccess, message: signUpMessage } = await signUpNewUser({
      email,
      password,
    });

    if (signUpSuccess === true) {
      const { success: updateSuccess, message: updateMessage } = await updateUserPersonalInformation({
        firstName,
        lastName,
      });

      if (updateSuccess === true) {
        router.refresh();
        dispatch(openDialog('signUpDialog'));
        setFormData(defaultFormData);
        toast.success(`Welcome, ${firstName}!`);
      } else {
        toast.error(updateMessage);
      }
    } else {
      toast.error(signUpMessage);
    }

    setIsLoading(false);
    !isWelcomePath ? dispatch(setIsDialogLoading(false)) : null;
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
                type={field.type ?? 'text'}
                value={formData[field.name as keyof typeof formData]}
                autoComplete={field.autoComplete}
                autoFocus={field.name === 'firstName'}
                required={true}
                fullWidth={true}
                onChange={handleInputChange}
              />
            </Grid>
          ))}
        </Grid>
        <ContainedButton
          label={isWelcomePath && isLoading ? '' : 'sign up'}
          disabled={isLoading}
          isLoading={isWelcomePath && isLoading}
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
