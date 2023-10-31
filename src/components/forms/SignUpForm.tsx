'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Box, Link, Grid } from '@mui/material';
import FormTitle from './FormTitle';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsModalOpen, setModalContent, setShowModalLoadingBar } from '@/lib/redux/modal/modalSlice';
import CustomButton from '../ui/buttons/CustomButton';
import CustomTextField from '../ui/inputFields/CustomTextField';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

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

export default function SignUpForm() {
  const supabase = createClientComponentClient<Database>();
  const dispatch = useAppDispatch();
  const color = useCustomColorPalette();
  const router = useRouter();
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
    setIsLoading(true);
    dispatch(setShowModalLoadingBar(true));

    if (formData.password !== formData.confirm_password) {
      setIsLoading(false);
      return toast.error('Passwords do not match.');
    }

    const { email, password, first_name, last_name } = formData;

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpData) {
        const user_id = signUpData.user?.id ?? '';
        const { error: updateError } = await supabase
          .from('users')
          .update({ first_name, last_name })
          .eq('user_id', user_id);

        if (updateError) {
          toast.error(`Update user failed. ${updateError.message}.`);
        } else {
          setFormData(defaultFormData);
          dispatch(setIsModalOpen(false));
        }
      } else if (signUpError) {
        toast.error(`Sign up failed. ${signUpError.message}.`);
      }
    } catch (error) {
      toast.error('Sign up failed. Please try again later.');
    } finally {
      dispatch(setShowModalLoadingBar(false));
      setIsLoading(false);
      router.refresh();
      toast.info(`Welcome, ${first_name}!`);
    }
  }

  function handleOpenSignInModal() {
    dispatch(setIsModalOpen(false));
    setTimeout(() => dispatch(setModalContent('signIn')), 300);
    setTimeout(() => dispatch(setIsModalOpen(true)), 500);
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
                autoFocus={field.name === 'firstName'}
              />
            </Grid>
          ))}
        </Grid>
        <CustomButton
          label="sign up"
          disabled={isLoading}
          type="submit"
          styles={{
            marginTop: 3,
            marginBottom: 3,
            backgroundColor: color.blue.dark,
            '&:hover': { backgroundColor: color.blue.light },
          }}
          fullWidth={true}
        />
        <Link
          onClick={handleOpenSignInModal}
          sx={{ cursor: 'pointer' }}
          component="p"
          variant="body2">
          Already have an account? Sign in
        </Link>
      </Box>
    </Box>
  );
}
