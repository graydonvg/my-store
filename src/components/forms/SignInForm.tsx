'use client';

import { useState, ChangeEvent, FormEvent, ReactNode } from 'react';
import { Box, Divider, Grid, Typography, useTheme } from '@mui/material';
import FormHeader from './FormHeader';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeDialog, setIsDialogLoading } from '@/lib/redux/slices/dialogSlice';
import ContainedButton from '../ui/buttons/ContainedButton';
import CustomTextField from '../ui/inputFields/CustomTextField';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import createSupabaseBrowserClient from '@/lib/supabase/supabase-browser';
import signInWithPassword from '@/services/auth/sign-in';
import { Email, Lock } from '@mui/icons-material';

const formFields = [
  { label: 'Email Address', name: 'email', type: 'email', autoComplete: 'email', required: true, icon: <Email /> },
  {
    label: 'Password',
    name: 'password',
    type: 'password',
    autoComplete: 'current-password',
    required: true,
    icon: <Lock />,
  },
];

const defaultFormData = {
  email: '',
  password: '',
};

type Props = {
  children: ReactNode;
};

export default function SignInForm({ children }: Props) {
  const theme = useTheme();
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
        gap: 3,
        paddingBottom: 3,
      }}>
      <FormHeader text="Sign in" />
      <Box
        component="form"
        onSubmit={handleSignInWithPassword}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3, paddingX: 3 }}>
        <Grid
          container
          spacing={2}>
          {formFields.map((field) => (
            <Grid
              item
              xs={12}
              key={field.name}>
              <CustomTextField
                key={field.name}
                label={field.label}
                name={field.name}
                type={field.type}
                value={formData[field.name as keyof typeof formData]}
                autoComplete={field.autoComplete}
                autoFocus={field.name === 'email'}
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 1 }}>
          <ContainedButton
            type="submit"
            label={!isSignInDialogOpen && isLoading ? '' : 'sign in'}
            disabled={isLoading}
            isLoading={!isSignInDialogOpen && isLoading}
            fullWidth
            color="primary"
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
            fullWidth
            startIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="24"
                height="24"
                viewBox="0 0 48 48">
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
              </svg>
            }
            sxStyles={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 1)' } }}
          />
        </Box>
        {children}
      </Box>
    </Box>
  );
}
