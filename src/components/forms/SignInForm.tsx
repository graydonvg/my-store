'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Box, Divider, Link, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FormTitle from './FormTitle';
import { useAppDispatch } from '@/lib/redux/hooks';
import {
  closeModal,
  setIsSignInModalOpen,
  setIsSignUpModalOpen,
  setShowModalLoadingBar,
} from '@/lib/redux/modal/modalSlice';
import CustomButton from '../ui/buttons/CustomButton';
import CustomTextField from '../ui/inputFields/CustomTextField';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import createSupabaseBrowserClient from '@/lib/supabase/supabase-browser';
import signInWithPassword from '@/services/auth/sign-in';

const formFields = [
  { name: 'email', label: 'Email Address', type: 'email', autoComplete: 'email' },
  { name: 'password', label: 'Password', type: 'password', autoComplete: 'current-password' },
];

const defaultFormData = {
  email: '',
  password: '',
};

export default function SignInForm() {
  const supabase = createSupabaseBrowserClient();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState(defaultFormData);
  const router = useRouter();

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevFormValues) => ({ ...prevFormValues, [name]: value }));
  }

  async function handleSignInWithPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    dispatch(setShowModalLoadingBar(true));

    try {
      const { success, message } = await signInWithPassword({ email: formData.email, password: formData.password });

      if (success === true) {
        dispatch(setIsSignInModalOpen(false));
        setFormData(defaultFormData);
        router.refresh();
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error(`Sign in failed. Please try again later.`);
    } finally {
      setIsLoading(false);
      dispatch(setShowModalLoadingBar(false));
    }
  }

  async function handleSignInWithGoogle() {
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
      dispatch(setIsSignInModalOpen(false));
    } catch (error) {
      toast.error('Failed to sign in.');
    } finally {
      dispatch(setShowModalLoadingBar(false));
      setIsLoading(false);
      router.refresh();
    }
  }

  function handleOpenSignUpModal() {
    dispatch(closeModal());
    dispatch(setIsSignUpModalOpen(true));
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
        onSubmit={handleSignInWithPassword}>
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
          }}
          fullWidth={true}
          backgroundColor="blue"
        />
        <Divider>
          <Typography
            component="span"
            variant="caption">
            OR
          </Typography>
        </Divider>
        <CustomButton
          onClick={handleSignInWithGoogle}
          label="sign in with google"
          disabled={isLoading}
          type="button"
          styles={{
            marginTop: 2,
            marginBottom: 3,
          }}
          fullWidth={true}
          startIcon={<GoogleIcon />}
          backgroundColor="blue"
        />
        <Link
          onClick={handleOpenSignUpModal}
          sx={{ cursor: 'pointer' }}
          component="p"
          variant="body2">
          Don&apos;t have an account? Sign Up
        </Link>
      </Box>
    </Box>
  );
}
