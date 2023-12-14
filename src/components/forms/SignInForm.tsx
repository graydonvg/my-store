'use client';

import { useState, ChangeEvent, FormEvent, ReactNode } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FormTitle from './FormTitle';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsSignInDialogOpen, setShowDialogLoadingBar } from '@/lib/redux/dialog/dialogSlice';
import ContainedButton from '../ui/buttons/ContainedButton';
import CustomTextField from '../ui/inputFields/CustomTextField';
import { toast } from 'react-toastify';
import { usePathname, useRouter } from 'next/navigation';
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

type Props = {
  children: ReactNode;
};

export default function SignInForm({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createSupabaseBrowserClient();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState(defaultFormData);
  const isWelcomePath = pathname.includes('/welcome');

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevFormValues) => ({ ...prevFormValues, [name]: value }));
  }

  async function handleSignInWithPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    !isWelcomePath ? dispatch(setShowDialogLoadingBar(true)) : null;

    try {
      const { success, message } = await signInWithPassword({ email: formData.email, password: formData.password });

      if (success === true) {
        router.refresh();
        dispatch(setIsSignInDialogOpen(false));
        setFormData(defaultFormData);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error('Sign in failed. Please try again later.');
    } finally {
      setIsLoading(false);
      dispatch(setShowDialogLoadingBar(false));
    }
  }

  async function handleSignInWithGoogle() {
    !isWelcomePath ? dispatch(setShowDialogLoadingBar(true)) : null;

    try {
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
    } catch (error) {
      toast.error('Sign in failed. Please try again later.');
    } finally {
      dispatch(setShowDialogLoadingBar(false));
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
        <ContainedButton
          label={isWelcomePath && isLoading ? '' : 'sign in'}
          isDisabled={isLoading}
          isLoading={isWelcomePath && isLoading}
          type="submit"
          styles={{
            marginTop: 3,
            marginBottom: 2,
          }}
          fullWidth
          backgroundColor="blue"
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
          onClick={handleSignInWithGoogle}
          label="sign in with google"
          type="button"
          styles={{
            marginTop: 2,
            marginBottom: 3,
          }}
          fullWidth
          startIcon={<GoogleIcon />}
          backgroundColor="blue"
        />
        {children}
      </Box>
    </Box>
  );
}
