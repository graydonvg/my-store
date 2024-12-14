'use client';

import { ReactNode, useState } from 'react';
import { Box, Divider, Grid2, Typography, useTheme } from '@mui/material';
import FormHeader from './FormHeader';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeDialog, setIsDialogLoading } from '@/lib/redux/features/dialog/dialogSlice';
import ContainedButton from '../ui/buttons/ContainedButton';
import CustomTextField from '../ui/CustomTextField';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import createSupabaseBrowserClient from '@/lib/supabase/supabase-browser';
import signInWithPassword, { signInAsAdmin } from '@/services/auth/sign-in';
import { Email, Lock } from '@mui/icons-material';
import GoogleIcon from '../ui/GoogleIcon';
import OutlinedButton from '../ui/buttons/OutlinedButton';
import { selectIsSignInDialogOpen } from '@/lib/redux/features/dialog/dialogSelectors';
import useForm from '@/hooks/use-form';
import { UserAuthDataSchema } from '@/types';

const fieldConfigs = [
  {
    label: 'Email',
    id: 'email',
    name: 'email',
    type: 'email',
    autoComplete: 'email',
    icon: <Email />,
    ariaDescribedBy: 'email-helper-text',
    required: true,
  },
  {
    label: 'Password',
    id: 'password',
    name: 'password',
    type: 'password',
    autoComplete: 'current-password',
    icon: <Lock />,
    ariaDescribedBy: 'password-helper-text',
    required: true,
  },
];

const defaultFormData = {
  email: '',
  password: '',
};

const defaultLoadingStates = {
  signInWithPassword: false,
  signInWithGoogle: false,
  signInAsAdmin: false,
};

type Props = {
  headerComponent: 'h1' | 'h2';
  children: ReactNode;
};

export default function SignInForm({ headerComponent, children }: Props) {
  const form = useForm(UserAuthDataSchema, defaultFormData);
  const theme = useTheme();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const dispatch = useAppDispatch();
  const isSignInDialogOpen = useAppSelector(selectIsSignInDialogOpen);
  const [isLoading, setIsLoading] = useState(defaultLoadingStates);
  const disableButtons = isLoading.signInWithPassword || isLoading.signInWithGoogle || isLoading.signInAsAdmin;

  async function handleSignInWithPassword() {
    setIsLoading((prev) => ({ ...prev, signInWithPassword: true }));

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

    setIsLoading((prev) => ({ ...prev, signInWithPassword: false }));

    if (isSignInDialogOpen) {
      dispatch(setIsDialogLoading(false));
    }
  }

  async function signInWithGoogle() {
    setIsLoading((prev) => ({ ...prev, signInWithGoogle: true }));

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

    setIsLoading((prev) => ({ ...prev, signInWithGoogle: false }));

    if (isSignInDialogOpen) {
      dispatch(setIsDialogLoading(false));
    }
  }

  async function handleSignInAsAdmin() {
    setIsLoading((prev) => ({ ...prev, signInAsAdmin: true }));

    if (isSignInDialogOpen) {
      dispatch(setIsDialogLoading(true));
    }

    const { success, message } = await signInAsAdmin();

    if (success) {
      dispatch(closeDialog());
      form.reset();
      router.refresh();
    } else {
      toast.error(message);
    }

    setIsLoading((prev) => ({ ...prev, signInAsAdmin: false }));

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
          {fieldConfigs.map((field) => (
            <Grid2
              key={field.id}
              size={12}>
              <CustomTextField
                label={field.label}
                id={field.id}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                value={form.values[field.name as keyof typeof form.values]}
                onChange={form.handleChange}
                hasValue={!!form.values[field.name as keyof typeof form.values]}
                fullWidth
                required={field.required}
                icon={field.icon}
                aria-invalid={!!form.errors[field.name as keyof typeof form.errors]}
                error={!!form.errors[field.name as keyof typeof form.errors]}
                helperText={form.errors[field.name as keyof typeof form.errors]}
                aria-describedby={field.ariaDescribedBy}
                sxStyles={{ backgroundColor: theme.palette.custom.dialog.background.accent }}
              />
            </Grid2>
          ))}
        </Grid2>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 1 }}>
          <ContainedButton
            type="submit"
            label={!isSignInDialogOpen && isLoading.signInWithPassword ? '' : 'sign in'}
            disabled={disableButtons}
            isLoading={!isSignInDialogOpen && isLoading.signInWithPassword}
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
            disabled={disableButtons}
            isLoading={!isSignInDialogOpen && isLoading.signInWithGoogle}
            label={!isSignInDialogOpen && isLoading.signInAsAdmin ? '' : 'sign in with google'}
            type="button"
            fullWidth
            startIcon={<GoogleIcon />}
          />
        </Box>
        {children}
        <ContainedButton
          type="button"
          onClick={handleSignInAsAdmin}
          label={!isSignInDialogOpen && isLoading.signInAsAdmin ? '' : 'sign in as admin'}
          disabled={disableButtons}
          isLoading={!isSignInDialogOpen && isLoading.signInAsAdmin}
          fullWidth
          color="secondary"
        />
      </Box>
    </Box>
  );
}
