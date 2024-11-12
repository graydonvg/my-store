'use client';

import { ReactNode, useState } from 'react';
import { Box, Divider, Grid2, Typography, useTheme } from '@mui/material';
import FormHeader from './FormHeader';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeDialog, setIsDialogLoading } from '@/lib/redux/features/dialog/dialogSlice';
import ContainedButton from '../ui/buttons/simple/ContainedButton';
import CustomTextField from '../ui/inputFields/CustomTextField';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import createSupabaseBrowserClient from '@/lib/supabase/supabase-browser';
import signInWithPassword from '@/services/auth/sign-in';
import { Email, Lock } from '@mui/icons-material';
import GoogleIcon from '../ui/GoogleIcon';
import OutlinedButton from '../ui/buttons/simple/OutlinedButton';
import { selectIsSignInDialogOpen } from '@/lib/redux/features/dialog/dialogSelectors';
import useForm from '@/hooks/use-form';
import { UserAuthDataSchema } from '@/types';

const DEFAULT_FORM_DATA = {
  email: '',
  password: '',
};

type Props = {
  headerComponent: 'h1' | 'h2';
  children: ReactNode;
};

export default function SignInForm({ headerComponent, children }: Props) {
  const form = useForm(UserAuthDataSchema, DEFAULT_FORM_DATA);
  const theme = useTheme();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const dispatch = useAppDispatch();
  const isSignInDialogOpen = useAppSelector(selectIsSignInDialogOpen);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignInWithPassword() {
    setIsLoading(true);

    if (isSignInDialogOpen) {
      dispatch(setIsDialogLoading(true));
    }

    const { success, message } = await signInWithPassword(form.values);

    if (success === true) {
      dispatch(closeDialog());
      form.reset();
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
      <FormHeader
        headerComponent={headerComponent}
        text="Sign in"
      />
      <Box
        component="form"
        noValidate
        onSubmit={form.handleSubmit(handleSignInWithPassword)}
        sx={{ display: 'flex', flexDirection: 'column', gap: 3, paddingX: 2 }}>
        <Grid2
          container
          spacing={2}>
          <Grid2 size={12}>
            <CustomTextField
              label="Email"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.values.email}
              onChange={form.handleChange}
              hasValue={form.values.email.length > 0}
              autoFocus
              fullWidth
              required
              icon={<Email />}
              aria-invalid={!!form.errors.email}
              error={!!form.errors.email}
              helperText={form.errors.email}
              aria-describedby="email-helper-text"
              sxStyles={{ backgroundColor: theme.palette.custom.dialog.background.accent }}
            />
          </Grid2>
          <Grid2 size={12}>
            <CustomTextField
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.values.password}
              onChange={form.handleChange}
              hasValue={form.values.password.length > 0}
              fullWidth
              required
              icon={<Lock />}
              aria-invalid={!!form.errors.password}
              error={!!form.errors.password}
              helperText={form.errors.password}
              aria-describedby="password-helper-text"
              sxStyles={{ backgroundColor: theme.palette.custom.dialog.background.accent }}
            />
          </Grid2>
        </Grid2>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 1 }}>
          <ContainedButton
            type="submit"
            label={!isSignInDialogOpen && isLoading ? '' : 'sign in'}
            disabled={isSignInDialogOpen && isLoading}
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
          <OutlinedButton
            onClick={signInWithGoogle}
            disabled={isLoading}
            label="sign in with google"
            type="button"
            fullWidth
            startIcon={<GoogleIcon />}
          />
        </Box>
        {children}
      </Box>
    </Box>
  );
}
