'use client';

import { useState, ChangeEvent, FormEvent, ReactNode } from 'react';
import { Box, Grid } from '@mui/material';
import FormTitle from './FormTitle';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsSignUpDialogOpen, setShowDialogLoadingBar } from '@/lib/redux/dialog/dialogSlice';
import ContainedButton from '../ui/buttons/ContainedButton';
import CustomTextField from '../ui/inputFields/CustomTextField';
import { toast } from 'react-toastify';
import { usePathname, useRouter } from 'next/navigation';
import signUpNewUser from '@/services/auth/sign-up';
import { updateUserPersonalInformation } from '@/services/users/update-user';

const formFields = [
  { label: 'First Name', name: 'first_name', autoComplete: 'given-name' },
  { label: 'Last Name', name: 'last_name', autoComplete: 'family-name' },
  { label: 'Email Address', name: 'email', autoComplete: 'email' },
  { label: 'Password', name: 'password', type: 'password', autoComplete: 'new-password' },
  { label: 'Confirm Password', name: 'confirm_password', type: 'password', autoComplete: 'new-password' },
];

const defaultFormData = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirm_password: '',
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

    if (formData.password !== formData.confirm_password) {
      return toast.error('Passwords do not match.');
    }

    setIsLoading(true);

    !isWelcomePath ? dispatch(setShowDialogLoadingBar(true)) : null;

    const { email, password, first_name, last_name } = formData;

    try {
      const { success: signUpSuccess, message: signUpMessage } = await signUpNewUser({
        email,
        password,
      });

      if (signUpSuccess === true) {
        const { success: updateSuccess, message: updateMessage } = await updateUserPersonalInformation({
          first_name,
          last_name,
          contact_number: null,
        });

        if (updateSuccess === true) {
          router.refresh();
          dispatch(setIsSignUpDialogOpen(false));
          setFormData(defaultFormData);
          toast.success(`Welcome, ${first_name}!`);
        } else {
          toast.error(updateMessage);
        }
      } else {
        toast.error(signUpMessage);
      }
    } catch (error) {
      toast.error('Sign up failed. Please try again later.');
    } finally {
      setIsLoading(false);
      !isWelcomePath ? dispatch(setShowDialogLoadingBar(false)) : null;
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
      <FormTitle text="Sign up" />
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
              sm={field.name === 'first_name' || field.name === 'last_name' ? 6 : false}
              key={field.name}>
              <CustomTextField
                required={true}
                fullWidth={true}
                id={field.name}
                label={field.label}
                name={field.name}
                type={field.type || 'text'}
                autoComplete={field.autoComplete}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleInputChange}
                autoFocus={field.name === 'first_name'}
              />
            </Grid>
          ))}
        </Grid>
        <ContainedButton
          label={isWelcomePath && isLoading ? '' : 'sign up'}
          isDisabled={isLoading}
          isLoading={isWelcomePath && isLoading}
          type="submit"
          styles={{
            marginTop: 3,
            marginBottom: 3,
          }}
          fullWidth
          backgroundColor="blue"
        />
        {children}
      </Box>
    </Box>
  );
}
