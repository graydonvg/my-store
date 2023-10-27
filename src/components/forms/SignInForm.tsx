'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Box, Divider, Link, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import ModalProgressBar from '../ui/progress/LoadingBar';
import FormTitle from './FormTitle';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsModalOpen, setModalContent, setShowModalLoadingBar } from '@/lib/redux/modal/modalSlice';
import CustomButton from '../ui/buttons/CustomButton';
import CustomTextField from '../ui/inputFields/CustomTextField';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { toast } from 'react-toastify';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';
import signInUserWithPassword from '@/services/sing-in';
import { useRouter } from 'next/navigation';

const formFields = [
  { name: 'email', label: 'Email Address', type: 'email', autoComplete: 'email' },
  { name: 'password', label: 'Password', type: 'password', autoComplete: 'current-password' },
];

const defaultFormData = {
  email: '',
  password: '',
};

export default function SignInForm() {
  const supabase = createClientComponentClient();
  const dispatch = useAppDispatch();
  const color = useCustomColorPalette();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState(defaultFormData);
  const router = useRouter();

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevFormValues) => ({ ...prevFormValues, [name]: value }));
  }

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    dispatch(setShowModalLoadingBar(true));

    try {
      const response = await signInUserWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        setFormData(defaultFormData);
        dispatch(setIsModalOpen(false));
      } else {
        toast.error(`Sign in failed. ${response.statusText}.`);
      }
    } catch (error) {
      toast.error('Sign in failed. Please try again later.');
    } finally {
      dispatch(setShowModalLoadingBar(false));
      setIsLoading(false);
      router.refresh();
    }
  }

  async function signInWithGoogleAndCreateUser() {
    setIsLoading(true);
    dispatch(setShowModalLoadingBar(true));

    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/api/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      dispatch(setIsModalOpen(false));
    } catch (error) {
      toast.error('Failed to sign in.');
    } finally {
      dispatch(setShowModalLoadingBar(false));
      setIsLoading(false);
      router.refresh();
    }
  }

  function openSignUpModal() {
    dispatch(setIsModalOpen(false));
    setTimeout(() => dispatch(setModalContent('signUp')), 300);
    setTimeout(() => dispatch(setIsModalOpen(true)), 500);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
      }}>
      <FormTitle text="Sign in" />
      <Box
        component="form"
        onSubmit={handleSignIn}>
        {formFields.map((field) => (
          <CustomTextField
            key={field.name}
            margin="normal"
            required={true}
            fullWidth={true}
            id={field.name}
            label={field.label}
            name={field.name}
            type={field.type}
            autoComplete={field.autoComplete}
            value={formData[field.name as keyof typeof formData]}
            onChange={handleInputChange}
            autoFocus={field.name === 'email'}
          />
        ))}
        <CustomButton
          label="sign in"
          disabled={isLoading}
          type="submit"
          styles={{
            marginTop: 3,
            marginBottom: 2,
            backgroundColor: color.blue.dark,
            '&:hover': { backgroundColor: color.blue.light },
          }}
          fullWidth={true}
        />
        <Divider>
          <Typography
            component="span"
            variant="caption">
            OR
          </Typography>
        </Divider>
        <CustomButton
          onClick={signInWithGoogleAndCreateUser}
          label="sign in with google"
          disabled={isLoading}
          type="button"
          styles={{
            marginTop: 2,
            marginBottom: 3,
            backgroundColor: color.blue.dark,
            '&:hover': { backgroundColor: color.blue.light },
          }}
          fullWidth={true}
          startIcon={<GoogleIcon />}
        />
        <Link
          onClick={openSignUpModal}
          sx={{ cursor: 'pointer' }}
          component="p"
          variant="body2">
          Don&apos;t have an account? Sign Up
        </Link>
      </Box>
    </Box>
  );
}
