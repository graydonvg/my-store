'use client';

import { useState, ChangeEvent, FormEvent, ReactNode } from 'react';
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
import { UserAuthDataSchema } from '@/types';
import { CONSTANTS } from '@/constants';
import { useLogger } from 'next-axiom';
import { constructZodErrorMessage } from '@/utils/constructZodError';

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
  headerComponent: 'h1' | 'h2';
  children: ReactNode;
};

export default function SignInForm({ headerComponent, children }: Props) {
  const log = useLogger();
  const theme = useTheme();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const dispatch = useAppDispatch();
  const isSignInDialogOpen = useAppSelector(selectIsSignInDialogOpen);
  const [isLoading, setIsLoading] = useState(false);
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

    const validation = UserAuthDataSchema.safeParse(formData);

    if (!validation.success) {
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, {
        payload: { email: formData.email },
        error: validation.error,
      });

      const errorMessage = constructZodErrorMessage(validation.error);

      toast.error(errorMessage);
      return;
    }

    const { success, message } = await signInWithPassword(formData);

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
        onSubmit={handleSignInWithPassword}
        sx={{ display: 'flex', flexDirection: 'column', gap: 3, paddingX: 2 }}>
        <Grid2
          container
          spacing={2}>
          {formFields.map((field) => (
            <Grid2
              size={{ xs: 12 }}
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
            </Grid2>
          ))}
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
