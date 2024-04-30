'use client';

import { useState, ChangeEvent, FormEvent, ReactNode } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FormHeading from './FormHeading';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeDialog, setIsDialogLoading } from '@/lib/redux/slices/dialogSlice';
import ContainedButton from '../ui/buttons/ContainedButton';
import CustomTextField from '../ui/inputFields/CustomTextField';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import createSupabaseBrowserClient from '@/lib/supabase/supabase-browser';
import signInWithPassword from '@/services/auth/sign-in';

const formFields = [
  { label: 'Email Address', name: 'email', type: 'email', autoComplete: 'email' },
  { label: 'Password', name: 'password', type: 'password', autoComplete: 'current-password' },
];

const defaultFormData = {
  email: '',
  password: '',
};

type Props = {
  children: ReactNode;
};

export default function SignInForm({ children }: Props) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const dispatch = useAppDispatch();
  const isSignInDialogOpen = useAppSelector((state) => state.dialog.signInDialog);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState(defaultFormData);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevFormValues) => ({ ...prevFormValues, [name]: value }));
  }

  async function handleSignInWithPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    if (isSignInDialogOpen) {
      dispatch(setIsDialogLoading(true));
    }

    const { success, message } = await signInWithPassword({ email: formData.email, password: formData.password });

    if (success === true) {
      dispatch(closeDialog());
      setFormData(defaultFormData);
      router.refresh();
    } else {
      toast.error(message);
    }

    setIsLoading(false);

    if (isSignInDialogOpen) {
      dispatch(setIsDialogLoading(false));
    }
  }

  async function signInWithGoogle() {
    if (isSignInDialogOpen) {
      dispatch(setIsDialogLoading(true));
    }

    // Remember Supabase redirect url for google sign in
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/api/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      toast.error(error.message);
    }

    if (isSignInDialogOpen) {
      dispatch(setIsDialogLoading(false));
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
      }}>
      <FormHeading text="Sign in" />
      <Box
        component="form"
        onSubmit={handleSignInWithPassword}>
        {formFields.map((field) => (
          <CustomTextField
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type}
            value={formData[field.name as keyof typeof formData]}
            autoComplete={field.autoComplete}
            autoFocus={field.name === 'email'}
            margin="normal"
            required={true}
            fullWidth={true}
            onChange={handleInputChange}
          />
        ))}
        <ContainedButton
          type="submit"
          label={!isSignInDialogOpen && isLoading ? '' : 'sign in'}
          disabled={isLoading}
          isLoading={!isSignInDialogOpen && isLoading}
          styles={{
            marginTop: 3,
            marginBottom: 2,
          }}
          fullWidth
          backgroundColor="primary"
        />
        <Divider>
          <Typography
            component="span"
            variant="caption">
            OR
          </Typography>
        </Divider>
        {/* Remember Supabase redirect url for google sign in */}
        <ContainedButton
          onClick={signInWithGoogle}
          disabled={isLoading}
          label="sign in with google"
          type="button"
          styles={{
            marginTop: 2,
            marginBottom: 3,
          }}
          fullWidth
          startIcon={<GoogleIcon />}
          backgroundColor="primary"
        />
        {children}
      </Box>
    </Box>
  );
}
